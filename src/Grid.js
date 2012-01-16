/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 30,
        columnWidth: 100,
        headerRowHeight: 30,
        footerRowHeight: 45,
        filterRowHeight: 30,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        headerCellTemplate: 'kgHeaderCellTemplate',
        footerTemplate: 'kgFooterTemplate',
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: [],
        pageSizes: [250, 500, 1000], //page Sizes
        enablePaging: false,
        defaultPageSize: 250, //Size of Paging data
        totalServerItems: null, //ko.observable of how many items are on the server (for paging)
        selectedItem: ko.observable(), //ko.observable
        selectedItems: ko.observableArray([]), //ko.observableArray
        isMultiSelect: true, //toggles between selectedItem & selectedItems
        displaySelectionCheckbox: true, //toggles whether row selection check boxes appear
        displayRowIndex: true, //shows the rowIndex cell at the far left of each row
        allowFiltering: true,
        minRowsToRender: ko.observable(1),
        maxRowWidth: ko.observable(120),
        pageChanged: function () { }
    },

    self = this,
    filterIsOpen = ko.observable(false),
    filterManager,
    isSorting = false,
    prevScrollTop, prevScrollLeft;

    this.$root; //this is the root element that is passed in with the binding handler
    this.$topPanel;
    this.$headerContainer;
    this.$headerScroller;
    this.$headers;
    this.$viewport;
    this.$canvas;
    this.$footerPanel;

    this.config = $.extend(defaults, options)
    this.gridId = "kg" + kg.utils.newId();
    this.initPhase = 0;


    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;

    filterManager = new kg.FilterManager(self.config);

    this.filterInfo = filterManager.filterInfo; //observable
    this.filteredData = filterManager.filteredData;

    this.maxRows = ko.computed(function () {
        var rows = self.filteredData();
        return rows.length || 0;
    });

    this.maxCanvasHeight = function () {
        var rows = self.filteredData();
        return rows.length * self.config.rowHeight;
    };

    this.selectedItemCount = ko.computed(function () {
        var single = self.config.selectedItem(),
            arr = self.config.selectedItems();

        if (!self.config.isMultiSelect) {
            return (single !== null && single !== undefined) ? 1 : 0; //truthy statement
        } else {
            return arr.length;
        }
    });


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
        rootMaxH: 0
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
            newDim = new kg.Dimension();

        newDim.outerHeight = self.config.footerRowHeight;
        newDim.outerWidth = rootDim.outerWidth;

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

    var prevMinRowsToRender;
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
            newDim = new kg.Dimension();

        newDim.autoFitHeight = true;
        newDim.outerWidth = self.totalRowWidth();

        if (vScrollBarIsOpen) { newDim.outerWidth += self.elementDims.scrollW; }

        return newDim;
    });

    //#endregion

    //#region Events

    this.config.selectedItem.subscribe(function (currentEntity) {
        //ensure outgoing entity is de-selected
        if (!self.config.isMultiSelect) {

            //uncheck the current entity
            if (currentEntity && currentEntity['__kg_selected__']) {
                currentEntity['__kg_selected__'](false);
            }
        }

    }, self, "beforeChange");

    this.config.selectedItem.subscribe(function (entity) {
        //ensure the current entity is checked
        if (entity && entity['__kg_selected__']) {
            entity['__kg_selected__'](true);
        }
    });

    this.changeSelectedItem = function (changedEntity) {
        var currentEntity = self.config.selectedItem(),
            currentItems = self.config.selectedItems,
            keep = false;

        if (!self.config.isMultiSelect) {
            //Single Select Logic

            //find out if the changed entity is selected or not
            if (changedEntity && changedEntity['__kg_selected__']) {
                keep = changedEntity['__kg_selected__']();
            }

            if (keep) {
                //set the new entity
                self.config.selectedItem(changedEntity);
            } else {
                //else just set it to null if there are no selected items
                self.config.selectedItem(null);
            }

        } else {
            //Multi-Select Logic

            //if the changed entity was de-selected, remove it from the array
            if (changedEntity && changedEntity['__kg_selected__']) {
                keep = changedEntity.__kg_selected__();
            }

            if (!keep) {
                currentItems.remove(changedEntity);
            } else {
                //first see if it exists, if not add it
                if (currentItems.indexOf(changedEntity) === -1) {
                    currentItems.push(changedEntity);
                }
            }
        }
    };

    this.pageChanged = ko.observable(1); //event for paging
    this.pageChanged.subscribe(self.config.pageChanged);

    this.sortData = function (col, dir) {
        isSorting = true;

        utils.forEach(self.columns(), function (column) {
            if (column.field !== col.field) {
                if (column.sortDirection() !== "") { column.sortDirection(""); }
            }
        });

        self.data.sort(function (a, b) {
            var propA = ko.utils.unwrapObservable(a[col.field]),
                propB = ko.utils.unwrapObservable(b[col.field]);

            if (dir === "asc") {
                return propA == propB ? 0 : (propA < propB ? -1 : 1);
            } else {
                return propA == propB ? 0 : (propA > propB ? -1 : 1);
            }
        });

        isSorting = false;
    };

    //#endregion

    //#region Rendering


    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!self.config.isMultiSelect) {
                return cnt === 1;
            }
            return cnt === self.maxRows();
        },
        write: function (val) {
            var checkAll = val,
                selectedItemsToPush = [],
                data,
                firstItem;

            if (self.config.isMultiSelect) {
                data = self.filteredData();
                firstItem = data[0];

                ko.utils.arrayForEach(data, function (entity) {
                    if (!entity['__kg_selected__']) { entity['__kg_selected__'] = ko.observable(checkAll); }
                    else {
                        //ko will suppress this if it was already selected                    
                        entity['__kg_selected__'](checkAll);
                    }

                    if (checkAll) {
                        selectedItemsToPush.push(entity);
                    }
                });

                self.config.selectedItems(selectedItemsToPush);

            } else {
                if (!checkAll) {
                    self.config.selectedItem(null);
                }
            }
        }
    });

    this.refreshDomSizes = function () {
        var dim = new kg.Dimension(),
            oldDim = self.rootDim(),
            rootH = 0,
            rootW = 0,
            canvasH = 0;

        //calculate the POSSIBLE biggest viewport height
        rootH = self.maxCanvasHeight() + self.config.headerRowHeight + self.config.footerRowHeight;

        //see which viewport heigth will be allowed to be used
        rootH = Math.min(self.elementDims.rootMaxH, rootH);

        //now calc the canvas height of what is going to be used in rendering
        canvasH = rootH - self.config.headerRowHeight - self.config.footerRowHeight;

        //get the max row Width for rendering
        rootW = self.totalRowWidth() + self.elementDims.rowWdiff;

        //now see if we are going to have a vertical scroll bar present
        if (self.maxCanvasHeight() > canvasH) {

            //if we are, then add that width to the max width 
            rootW += self.elementDims.scrollW;
        }

        //now see if we are constrained by any width dimensions
        dim.outerWidth = Math.min(self.elementDims.rootMaxW, rootW);
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

        //self.elementsNeedMeasuring = true;

        if (self.initPhase > 0) {

            //don't shrink the grid if we sorting or filtering
            if (!filterIsOpen() && !isSorting) {

                self.refreshDomSizes();

                kg.cssBuilder.buildStyles(self);

                if (self.$root) {
                    self.$root.show(); //unhide the grid after the rendering has finished
                }

            }
        }

    });

    var buildColumnDefsFromData = function () {
        var item;

        if (!self.data() || !self.data()[0]) {
            throw 'If auto-generating columns, "data" cannot be of null or undefined type!';
        }

        item = self.data()[0];

        utils.forIn(item, function (prop, propName) {

            self.config.columnDefs.push({
                field: propName
            });
        });

    };

    var buildColumns = function () {
        var columnDefs = self.config.columnDefs,
            cols = [],
            column;

        if (self.config.autogenerateColumns) { buildColumnDefsFromData(); }

        if (self.config.displaySelectionCheckbox) {
            columnDefs.splice(0, 0, { field: '__kg_selected__', width: self.elementDims.rowSelectedCellW });
        }
        if (self.config.displayRowIndex) {
            columnDefs.splice(0, 0, { field: 'rowIndex', width: self.elementDims.rowIndexCellW });
        }

        var createColumnSortClosure = function (col) {
            return function (dir) {
                if (dir) {
                    self.sortData(col, dir);
                }
            }
        }

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.width(colDef.width || self.config.columnWidth);

                column.sortDirection.subscribe(createColumnSortClosure(column));

                column.filter.subscribe(filterManager.createFilterChangeCallback(column));

                cols.push(column);
            });

            self.columns(cols);
        }
    };

    this.init = function () {

        buildColumns();

        //now if we are using the default templates, then make the generated ones unique
        if (self.config.rowTemplate === 'kgRowTemplate') {
            self.config.rowTemplate = self.gridId + self.config.rowTemplate;
        }

        if (self.config.headerTemplate === 'kgHeaderRowTemplate') {
            self.config.headerTemplate = self.gridId + self.config.headerTemplate;
        }

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable

        self.initPhase = 1;
    };

    this.showFilter_Click = function () {
        var isOpen = (filterIsOpen() ? false : true);

        utils.forEach(self.headerRow.headerCells, function (cell, i) {
            cell.filterVisible(isOpen);
        });

        filterIsOpen(isOpen);
    };

    this.clearFilter_Click = function () {
        utils.forEach(self.columns(), function (col, i) {
            col.filter(null);
        });
    };

    this.adjustScrollTop = function (scrollTop) {
        var rowIndex;

        if (prevScrollTop === scrollTop) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.config.minRowsToRender()));
    };

    this.adjustScrollLeft = function (scrollLeft) {
        if (self.$headerContainer) {
            self.$headerContainer.scrollLeft(scrollLeft);
        }
    };


    //call init
    self.init();
};