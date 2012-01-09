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
            return (ko.utils.unwrapObservable(item[filterInfo.field]) === filterInfo.filter);
        });
    });
    this.maxRows = ko.computed(function () {
        var rows = self.filteredData();
        return rows.length || 0;
    });

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
        viewportH: 0,
        viewportW: 0,
        scrollW: 0,
        scrollH: 0,
        cellHdiff: 0,
        cellWdiff: 0,
        rowWdiff: 0,
        rowHdiff: 0,
        headerWdiff: 0,
        headerHdiff: 0,
        headerCellWdiff: 0,
        headerCellHdiff: 0,
        footerWdiff: 0,
        footerHdiff: 0,
        rowIndexCellW: 25,
        rowSelectedCellW: 25
    };

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

        measureDomConstraints();

        calculateConstraints();

        kg.cssBuilder.buildStyles(self);

        self.rowManager.viewableRange(new kg.Range(0, self.config.minRowsToRender()));
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

    var measureDomConstraints = function () {
        var ruler = kg.domRuler;

        //pop the canvas, so we can measure the attributes
        self.$viewport.height(200).width(200);

        self.$canvas.height(100000); //pretty large, so the scroll bars, etc.. should open up
        self.$canvas.width(100000);


        //scrollBars
        $.extend(self.elementDims, ruler.measureScrollBar(self.$viewport));

        //rows
        $.extend(self.elementDims, ruler.measureRow(self.$canvas));

        //cells
        $.extend(self.elementDims, ruler.measureCell(self.$canvas));

        //header
        $.extend(self.elementDims, ruler.measureHeader(self.$headerScroller));

        //footer
        $.extend(self.elementDims, ruler.measureFooter(self.$footerPanel));

        //viewport
        self.elementDims.viewportH = self.$root.height() - self.config.headerRowHeight - self.elementDims.headerHdiff - self.config.footerRowHeight;
        self.elementDims.viewportW = self.$root.width();

        //Now set the dimensions

        //viewport
        self.$viewport.height(self.elementDims.viewportH);
        self.$viewport.width(self.elementDims.viewportW);

        //canvas
        self.$canvas.width(self.config.maxRowWidth() + self.elementDims.rowWdiff);
        //height is set in bindingHandler

        //headerContainer
        self.$headerContainer.height(self.config.headerRowHeight - self.elementDims.headerHdiff);
        self.$headerContainer.css("line-height", (self.config.headerRowHeight - self.elementDims.headerHdiff) + 'px');
        self.$headerContainer.width(self.elementDims.viewportW);

        //headerScroller
        self.$headerScroller.width(self.config.maxRowWidth() + self.elementDims.rowWdiff + self.elementDims.scrollW);
        self.$headerScroller.height(self.config.headerRowHeight - self.elementDims.headerHdiff);

        //footer
        self.$footerPanel.width(self.elementDims.viewportW);
        self.$footerPanel.height(self.config.footerRowHeight - self.elementDims.footerHdiff);
    };

    var calculateConstraints = function () {

        //figure out how many rows to render in the viewport based upon the viewable height
        self.config.minRowsToRender(Math.floor(self.elementDims.viewportH / self.config.rowHeight));

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
            column,
            rowWidth = 0;

        if (self.config.autogenerateColumns) { buildColumnDefsFromData(); }

        if (self.config.allowRowSelection) {
            columnDefs.splice(0, 0, { field: '__kg_selected__', width: self.elementDims.rowSelectedCellW });
        }
        if (self.config.displayRowIndex) {
            columnDefs.splice(0, 0, { field: 'rowIndex', width: self.elementDims.rowIndexCellW });
        }

        var createOffsetRightClosure = function (col, rowMaxWidthObs) {
            return function () {
                return ko.computed(function () {
                    var maxWidth = rowMaxWidthObs(),
                        width = col.width(),
                        offsetRight;

                    offsetRight = (maxWidth - col.offsetLeft());
                    offsetRight = offsetRight - width;
                    return offsetRight;
                });
            };
        };

        var createColumnSortClosure = function (col) {
            return function (dir) {
                self.sortData(col, dir);
            }
        }

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.offsetLeft(rowWidth);
                column.width(colDef.width || self.config.columnWidth);

                rowWidth += column.width(); //sum this up

                //setup the max col width observable
                column.offsetRight = createOffsetRightClosure(column, self.config.maxRowWidth)();


                column.sortDirection.subscribe(createColumnSortClosure(column));

                self.columns.push(column);
            });

            self.config.maxRowWidth(rowWidth);
        }

        self.config.rowTemplate = self.gridId + self.config.rowTemplate; //make it unique by id
        self.config.headerTemplate = self.gridId + self.config.headerTemplate; //make it unique by id
        self.config.headerCellTemplate = self.gridId + self.config.headerCellTemplate;
        self.config.footerTemplate = self.gridId + self.config.footerTemplate; //make it unique by id

    };

    this.init = function () {

        buildColumns();

        ensureTemplates();

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable
    };

    this.registerEvents = function () {
        self.$viewport.scroll(handleScroll);
    };

    this.registerFilters = function () {

        var showFilterRowHandler = function () {
            var isOpen = (filterIsOpen() ? false : true),
                $viewport = self.$viewport,
                $headerScroller = self.$headerScroller,
                $headerContainer = self.$headerContainer;

            utils.forEach(self.headerRow.headerCells, function (cell, i) {
                cell.filterVisible(isOpen);
            });

            if (isOpen) {
                $viewport.height($viewport.height() - self.config.filterRowHeight);
                $headerScroller.height($headerScroller.height() + self.config.filterRowHeight);
                $headerContainer.height($headerContainer.height() + self.config.filterRowHeight);
            } else {
                $viewport.height($viewport.height() + self.config.filterRowHeight);
                $headerScroller.height($headerScroller.height() - self.config.filterRowHeight);
                $headerContainer.height($headerContainer.height() - self.config.filterRowHeight);
            }

            filterIsOpen(isOpen);
        };

        //assign it
        utils.forEach(self.headerRow.headerCells, function (cell, i) {
            cell.showFilter = showFilterRowHandler;
        });
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
            text = kg.generateHeaderTemplate(self.columns());
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