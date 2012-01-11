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
        gridCssClass: 'koGrid',
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
        allowRowSelection: true, //toggles whether row selection check boxes appear
        displayRowIndex: true, //shows the rowIndex cell at the far left of each row
        allowFiltering: true,
        minRowsToRender: ko.observable(1),
        maxRowWidth: ko.observable(120),
        pageChanged: function () { }
    },

    self = this,
    filterIsOpen = ko.observable(false),
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

    this.filterInfo = ko.observable();

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;
    this.filteredData = ko.computed(function () {
        var filterInfo = self.filterInfo(),
            data = self.data();

        if (!filterInfo) {
            return data;
        }

        return ko.utils.arrayFilter(data, function (item) {
            var itemData = ko.utils.unwrapObservable(item[filterInfo.field]),
                itemDataStr,
                filterStr = filterInfo.filter.toUpperCase();

            if (itemData && filterStr) {
                if (typeof itemData === "string") {
                    itemDataStr = itemData.toUpperCase();
                    return itemDataStr.indexOf(filterStr) !== -1;
                } else {
                    itemDataStr = itemData.toString().toUpperCase();
                    return (itemDataStr.indexOf(filterStr) !== -1);
                }
            } else {
                return true;
            }
        });
    });

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
    this.selectedItemChanged = ko.observable(); //gets notified everytime a row is selected
    this.selectedItemChanged.subscribe(function (entity) {
        var isSelected = entity['__kg_selected__'](),
            selectedItem = self.config.selectedItem(),
            selectedItems = self.config.selectedItems;

        if (isSelected) {
            if (self.config.isMultiSelect) {
                selectedItems.push(entity);
            } else {
                if (selectedItem && selectedItem['__kg_selected__']) { selectedItem['__kg_selected__'](false); }
                self.config.selectedItem(entity);
            }
        } else {
            if (self.config.isMultiSelect) {
                selectedItems.remove(entity);
            } else {
                if (selectedItem === entity) {
                    self.config.selectedItem(null);
                }
            }
        }
    });

    this.pageChanged = ko.observable(1); //event for paging
    this.pageChanged.subscribe(self.config.pageChanged);

    this.sortData = function (col, dir) {
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
    };

    //#endregion

    //#region Rendering

    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!self.config.isMultiSelect) { return cnt === 1; }
            return cnt === self.maxRows();
        },
        write: function (val) {
            var checkAll = val;

            if (self.config.isMultiSelect) {
                ko.utils.arrayForEach(self.filteredData(), function (entity) {
                    if (!entity['__kg_selected__']) { entity['__kg_selected__'] = ko.observable(checkAll); }
                    else {
                        entity['__kg_selected__'](checkAll);
                    }
                    if (checkAll) {
                        self.config.selectedItems.push(entity);
                    } else {
                        self.config.selectedItems.remove(entity);
                    }
                });
            } else {
                if (!checkAll) {
                    self.config.selectedItem(null);
                }
            }
        }
    });

    this.update = function (rootDomNode) {
        //build back the DOM variables
        updateDomStructure(rootDomNode);

        self.refreshDomSizes();

        kg.cssBuilder.buildStyles(self);

        self.registerEvents();
    };

    var updateDomStructure = function (rootDomNode) {

        self.$root = $(rootDomNode);

        // the 'with' binding blows away everything except the inner html, so rebuild it

        //Headers
        self.$topPanel = $(".kgTopPanel", self.$root[0]);
        self.$headerContainer = $(".kgHeaderContainer", self.$topPanel[0]);
        self.$headerScroller = $(".kgHeaderScroller", self.$headerContainer[0]);
        self.$headers = self.$headerContainer.children();

        //Viewport
        self.$viewport = $(".kgViewport", self.$root[0]);

        //Canvas
        self.$canvas = $(".kgCanvas", self.$viewport[0]);

        //Footers
        self.$footerPanel = $(".kgFooterPanel", self.$root[0]);
    };

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

    var measureDomConstraints = function () {
        var $container = $('<div></div>').appendTo($('body'));

        //measure Scroll Bars
        $container.height(100).width(100).css("position", "absolute").css("overflow", "scroll");
        //$container.append($('<div style="height: 400px; width: 400px;"></div>'));

        self.elementDims.scrollH = $container.height() - $container[0].clientHeight;
        self.elementDims.scrollW = $container.width() - $container[0].clientWidth;

        $container.remove();
    };

    var buildColumnDefsFromData = function () {
        var item;

        if (!self.data() || !self.data()[0]) {
            throw 'If auto-generating columns, You must not provide a null or undefined object to generate against!';
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

        if (self.config.allowRowSelection) {
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

        var createFilterClosure = function (col) {
            return function (filterVal) {
                self.filterInfo({ field: col.field, filter: filterVal });
            };
        };

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.width(colDef.width || self.config.columnWidth);

                column.sortDirection.subscribe(createColumnSortClosure(column));

                column.filter.subscribe(createFilterClosure(column));

                cols.push(column);
            });

            self.columns(cols);
        }

        self.config.rowTemplate = self.gridId + self.config.rowTemplate; //make it unique by id
        self.config.headerTemplate = self.gridId + self.config.headerTemplate; //make it unique by id
        self.config.headerCellTemplate = self.gridId + self.config.headerCellTemplate;
        self.config.footerTemplate = self.gridId + self.config.footerTemplate; //make it unique by id
    };

    this.init = function () {

        measureDomConstraints();

        buildColumns();

        ensureTemplates();

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable
    };

    this.registerEvents = function () {
        self.$viewport.scroll(handleScroll);
    };

    this.showFilter_Click = function () {
        var isOpen = (filterIsOpen() ? false : true);

        utils.forEach(self.headerRow.headerCells, function (cell, i) {
            cell.filterVisible(isOpen);
        });

        filterIsOpen(isOpen);
    };

    var handleScroll = function (e) {
        var scrollTop = e.target.scrollTop,
            scrollLeft = e.target.scrollLeft,
            rowIndex;

        self.$headerContainer.scrollLeft(scrollLeft);

        if (prevScrollTop === scrollTop) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.config.minRowsToRender()));

    };

    var ensureTemplates = function () {
        var text = '',
            appendTemplateToFooter = function (templateText, id) {
                var tmpl = document.createElement("SCRIPT");
                tmpl.type = "text/html";
                tmpl.id = id;
                tmpl.innerText = templateText;
                document.body.appendChild(tmpl);
            };

        //Row Template
        if (!document.getElementById(self.config.rowTemplate)) {
            text = kg.generateRowTemplate(self.columns());
            appendTemplateToFooter(text, self.config.rowTemplate);
        }

        //Header Template
        if (!document.getElementById(self.config.headerTemplate)) {
            text = kg.generateHeaderTemplate({ columns: self.columns(), showFilter: self.config.allowFiltering });
            appendTemplateToFooter(text, self.config.headerTemplate);
        }

        //HeaderCell Template
        if (!document.getElementById(self.config.headerCellTemplate)) {
            text = kg.defaultHeaderCellTemplate();
            appendTemplateToFooter(text, self.config.headerCellTemplate);
        }

        //Footer Template
        if (!document.getElementById(self.config.footerTemplate)) {
            text = kg.defaultFooterTemplate();
            appendTemplateToFooter(text, self.config.footerTemplate);
        }

    };
};