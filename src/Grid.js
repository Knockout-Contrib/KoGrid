/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 30,
        columnWidth: 100,
        headerRowHeight: 30,
        footerRowHeight: 55,
        filterRowHeight: 30,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        headerCellTemplate: 'kgHeaderCellTemplate',
        footerTemplate: 'kgFooterTemplate',
        footerVisible: ko.observable(true),
        canSelectRows: true,
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: ko.observableArray([]),
        pageSizes: [250, 500, 1000], //page Sizes
        enablePaging: false,
        pageSize: ko.observable(250), //Size of Paging data
        totalServerItems: ko.observable(), //ko.observable of how many items are on the server (for paging)
        currentPage: ko.observable(1), //ko.observable of what page they are currently on
        selectedItems: ko.observableArray([]), //ko.observableArray
        selectedIndex: ko.observable(0), //observable of the index of the selectedItem in the data array
        displaySelectionCheckbox: true, //toggles whether row selection check boxes appear
        displayRowIndex: true, //shows the rowIndex cell at the far left of each row
        useExternalFiltering: false,
        useExternalSorting: false,
        filterInfo: ko.observable(), //observable that holds filter information (fields, and filtering strings)
        sortInfo: ko.observable(), //observable similar to filterInfo
        filterWildcard: "*",
        includeDestroyed: false, // flag to show _destroy=true items in grid
        selectWithCheckboxOnly: false,
        keepLastSelectedAround: false,
        isMultiSelect: true,
        lastClickedRow: ko.observable()
    },

    self = this,
    filterIsOpen = ko.observable(false), //observable so that the header can subscribe and change height when opened
    filterManager, //kg.FilterManager
    sortManager, //kg.SortManager
    isSorting = false,
    prevScrollTop,
    prevScrollLeft,
    prevMinRowsToRender,
    maxCanvasHt = 0,
    h_updateTimeout;

    this.$root; //this is the root element that is passed in with the binding handler
    this.$topPanel;
    this.$headerContainer;
    this.$headerScroller;
    this.$headers;
    this.$viewport;
    this.$canvas;
    this.$footerPanel;
    
    this.selectionManager;
    this.selectedItemCount;
    
    //If column Defs are not observable, make them so. Will not update dynamically this way.
    if (options.columnDefs && !ko.isObservable(options.columnDefs)){
        var observableColumnDefs = ko.observableArray(options.columnDefs);
        options.columnDefs = observableColumnDefs;
    }
    this.config = $.extend(defaults, options);
    this.gridId = "kg" + kg.utils.newId();
    this.initPhase = 0;


    // Set new default footer height if not overridden, and multi select is disabled
    if (this.config.footerRowHeight === defaults.footerRowHeight
        && !this.config.canSelectRows) {
        defaults.footerRowHeight = 30;
        this.config.footerRowHeight = 30;
    }
    
    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;

    filterManager = new kg.FilterManager(self.config);
    sortManager = new kg.SortManager({
        data: filterManager.filteredData,
        sortInfo: self.config.sortInfo,
        useExternalSorting: self.config.useExternalFiltering
    });

    this.sortInfo = sortManager.sortInfo; //observable
    this.filterInfo = filterManager.filterInfo; //observable
    this.finalData = sortManager.sortedData; //observable Array
    this.canvasHeight = ko.observable(maxCanvasHt.toString() + 'px');

    this.maxRows = ko.computed(function () {
        var rows = self.finalData();
        maxCanvasHt = rows.length * self.config.rowHeight;
        self.canvasHeight(maxCanvasHt.toString() + 'px');
        return rows.length || 0;
    });

    this.maxCanvasHeight = function () {
        return maxCanvasHt || 0;
    };

    this.columns = new kg.ColumnCollection();

    //initialized in the init method
    this.rowManager;
    this.rows;
    this.headerRow;
    this.footer;

    this.elementDims = {
        scrollW: 0,
        scrollH: 0,
        cellHdiff: 0,
        cellWdiff: 0,
        rowWdiff: 0,
        rowHdiff: 0,
        rowIndexCellW: 35,
        rowSelectedCellW: 25,
        rootMaxW: 0,
        rootMaxH: 0,
        rootMinW: 0,
        rootMinH: 0
    };
    this.elementsNeedMeasuring = true;

    //#region Container Dimensions

    this.rootDim = ko.observable(new kg.Dimension({ outerHeight: 20000, outerWidth: 20000 }));

    this.headerDim = ko.computed(function () {
        var rootDim = self.rootDim(),
            filterOpen = filterIsOpen(),
            newDim = new kg.Dimension();

        newDim.outerHeight = self.config.headerRowHeight;
        newDim.outerWidth = rootDim.outerWidth;

        if (filterOpen) {
            newDim.outerHeight += self.config.filterRowHeight;
        }

        return newDim;
    });

    this.footerDim = ko.computed(function () {
        var rootDim = self.rootDim(),
            showFooter = self.config.footerVisible(),
            newDim = new kg.Dimension();

        newDim.outerHeight = self.config.footerRowHeight;
        newDim.outerWidth = rootDim.outerWidth;

        if (!showFooter) {
            newDim.outerHeight = 3;
        }

        return newDim;
    });

    this.viewportDim = ko.computed(function () {
        var rootDim = self.rootDim(),
            headerDim = self.headerDim(),
            footerDim = self.footerDim(),
            newDim = new kg.Dimension();

        newDim.outerHeight = rootDim.outerHeight - headerDim.outerHeight - footerDim.outerHeight;
        newDim.outerWidth = rootDim.outerWidth;
        newDim.innerHeight = newDim.outerHeight;
        newDim.innerWidth = newDim.outerWidth;

        return newDim;
    });

    this.totalRowWidth = ko.computed(function () {
        var width = 0,
            cols = self.columns();

        utils.forEach(cols, function (col, i) {
            width += col.width();
        });

        return width;
    });

    this.minRowsToRender = ko.computed(function () {
        var viewportH = self.viewportDim().outerHeight || 1;

        if (filterIsOpen()) {
            return prevMinRowsToRender;
        };

        prevMinRowsToRender = Math.floor(viewportH / self.config.rowHeight);

        return prevMinRowsToRender;
    });


    this.headerScrollerDim = ko.computed(function () {
        var viewportH = self.viewportDim().outerHeight,
            filterOpen = filterIsOpen(), //register this observable
            maxHeight = self.maxCanvasHeight(),
            vScrollBarIsOpen = (maxHeight > viewportH),
            hScrollBarIsOpen = (self.viewportDim().outerWidth < self.totalRowWidth()),
            newDim = new kg.Dimension();

        newDim.autoFitHeight = true;
        newDim.outerWidth = self.totalRowWidth();

        if (vScrollBarIsOpen) { newDim.outerWidth += self.elementDims.scrollW; }
        else if ((maxHeight - viewportH) <= self.elementDims.scrollH) { //if the horizontal scroll is open it forces the viewport to be smaller
            newDim.outerWidth += self.elementDims.scrollW;
        }
        return newDim;
    });

    //#endregion

    //#region Events
    this.toggleSelectAll;

    this.sortData = function (col, dir) {
        isSorting = true;

        utils.forEach(self.columns(), function (column) {
            if (column.field !== col.field) {
                if (column.sortDirection() !== "") { column.sortDirection(""); }
            }
        });

        sortManager.sort(col, dir);

        isSorting = false;
    };

    //#endregion

    //keep selected item scrolled into view
    this.finalData.subscribe(function () {
         if (self.config.selectedItems()) {
            var lastItemIndex = self.config.selectedItems().length - 1;
            if (lastItemIndex <= 0) {
                var item = self.config.selectedItems()[lastItemIndex];
                if (item) {
                   scrollIntoView(item);
                }
            }
        }
    });

    var scrollIntoView = function (entity) {
        var itemIndex,
            viewableRange = self.rowManager.viewableRange();

        if (entity) {
            itemIndex = ko.utils.arrayIndexOf(self.finalData(), entity);
        }

        if (itemIndex > -1) {
            //check and see if its already in view!
            if (itemIndex > viewableRange.topRow || itemIndex < viewableRange.bottomRow - 5) {

                //scroll it into view
                self.rowManager.viewableRange(new kg.Range(itemIndex, itemIndex + self.minRowsToRender()));

                if (self.$viewport) {
                    self.$viewport.scrollTop(itemIndex * self.config.rowHeight);
                }
            }
        };
    };

    this.refreshDomSizes = function () {
        var dim = new kg.Dimension(),
            oldDim = self.rootDim(),
            rootH = 0,
            rootW = 0,
            canvasH = 0;

        self.elementsNeedMeasuring = true;

        //calculate the POSSIBLE biggest viewport height
        rootH = self.maxCanvasHeight() + self.config.headerRowHeight + self.config.footerRowHeight;

        //see which viewport height will be allowed to be used
        rootH = Math.min(self.elementDims.rootMaxH, rootH);
        rootH = Math.max(self.elementDims.rootMinH, rootH);

        //now calc the canvas height of what is going to be used in rendering
        canvasH = rootH - self.config.headerRowHeight - self.config.footerRowHeight;

        //get the max row Width for rendering
        rootW = self.totalRowWidth() + self.elementDims.rowWdiff;

        //now see if we are going to have a vertical scroll bar present
        if (self.maxCanvasHeight() > canvasH) {

            //if we are, then add that width to the max width 
            rootW += self.elementDims.scrollW || 0;
        }

        //now see if we are constrained by any width dimensions
        dim.outerWidth = Math.min(self.elementDims.rootMaxW, rootW);
        dim.outerWidth = Math.max(self.elementDims.rootMinW, dim.outerWidth);

        dim.outerHeight = rootH;

        //finally don't fire the subscriptions if we aren't changing anything!
        if (dim.outerHeight !== oldDim.outerHeight || dim.outerWidth !== oldDim.outerWidth) {

            //if its not the same, then fire the subscriptions
            self.rootDim(dim);
        }
    };

    this.refreshDomSizesTrigger = ko.computed(function () {
        //register dependencies
        var data = self.data();

        if (h_updateTimeout) {
            if (window.setImmediate) {
                window.clearImmediate(h_updateTimeout);
            } else {
                window.clearTimeout(h_updateTimeout);
            }
        }

        if (self.initPhase > 0) {

            //don't shrink the grid if we sorting or filtering
            if (!filterIsOpen() && !isSorting) {

                self.refreshDomSizes();

                kg.cssBuilder.buildStyles(self);

                if (self.initPhase > 0 && self.$root) {
                    self.$root.show();
                }
            }
        }

    });

    this.buildColumnDefsFromData = function () {
        if (self.config.columnDefs().length > 0){
            return;
        }
        if (!self.data() || !self.data()[0]) {
            throw 'If auto-generating columns, "data" cannot be of null or undefined type!';
        }

        var item;
        item = self.data()[0];

        utils.forIn(item, function (prop, propName) {
            if (propName === '__kg_selected__') {
                return;
            }

            self.config.columnDefs().push({
                field: propName
            });
        });

    };

    this.buildColumns = function () {
        var columnDefs = self.config.columnDefs,
            cols = [],
            column;

        if (self.config.autogenerateColumns) { self.buildColumnDefsFromData(); }

        if (self.config.displaySelectionCheckbox) {
            columnDefs().splice(0, 0, { field: '__kg_selected__', width: self.elementDims.rowSelectedCellW });
        }
        if (self.config.displayRowIndex) {
            columnDefs().splice(0, 0, { field: 'rowIndex', width: self.elementDims.rowIndexCellW });
        }
        
        var createColumnSortClosure = function (col) {
            return function (dir) {
                if (dir) {
                    self.sortData(col, dir);
                }
            }
        }

        if (columnDefs().length > 0) {

            utils.forEach(columnDefs(), function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.sortDirection.subscribe(createColumnSortClosure(column));
                
                column.filter.subscribe(filterManager.createFilterChangeCallback(column));

                cols.push(column);
            });

            self.columns(cols);
        }
    };

    this.init = function () {

        self.buildColumns();

        //now if we are using the default templates, then make the generated ones unique
        if (self.config.rowTemplate === 'kgRowTemplate') {
            self.config.rowTemplate = self.gridId + self.config.rowTemplate;
        }

        if (self.config.headerTemplate === 'kgHeaderRowTemplate') {
            self.config.headerTemplate = self.gridId + self.config.headerTemplate;
        }

        self.rowManager = new kg.RowManager(self);
        self.selectionManager = new kg.SelectionManager({
            isMultiSelect: self.config.isMultiSelect,
            data: self.finalData,
            selectedItem: self.config.selectedItem,
            selectedItems: self.config.selectedItems,
            selectedIndex: self.config.selectedIndex,
            lastClickedRow: self.config.lastClickedRow,
            isMulti: self.config.isMultiSelect
        }, self.rowManager);
        utils.forEach(self.columns(), function(col, i){
            col.width.subscribe(function(){
                self.rowManager.dataChanged = true;
                self.rowManager.rowCache = []; //if data source changes, kill this!
                self.rowManager.calcRenderedRange();
            });
        });
        self.selectedItemCount = self.selectionManager.selectedItemCount;
        self.toggleSelectAll = self.selectionManager.toggleSelectAll;
        self.rows = self.rowManager.rows; // dependent observable

        kg.cssBuilder.buildStyles(self);

        self.initPhase = 1;
    };

    this.update = function () {
        //we have to update async, or else all the observables are registered as dependencies

        var updater = function () {

            self.refreshDomSizes();

            kg.cssBuilder.buildStyles(self);

            if (self.initPhase > 0 && self.$root) {
                self.$root.show();
            }
        };

        if (window.setImmediate) {
            h_updateTimeout = setImmediate(updater);
        } else {
            h_updateTimeout = setTimeout(updater, 0);
        }
    };

    this.showFilter_Click = function () {
        var isOpen = (filterIsOpen() ? false : true);

        self.headerRow.filterVisible(isOpen);

        filterIsOpen(isOpen);
    };

    this.clearFilter_Click = function () {
        utils.forEach(self.columns(), function (col, i) {
            col.filter(null);
        });
    };

    this.adjustScrollTop = function (scrollTop, force) {
        var rowIndex;

        if (prevScrollTop === scrollTop && !force) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.minRowsToRender()));
    };

    this.adjustScrollLeft = function (scrollLeft) {
        if (self.$headerContainer) {
            self.$headerContainer.scrollLeft(scrollLeft);
        }
    };

    //call init
    self.init();
};