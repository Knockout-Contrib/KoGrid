/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 25,
        columnWidth: 120,
        headerRowHeight: 35,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        footerTemplate: null,
        gridCssClass: 'koGrid',
        autogenerateColumns: true,
        autoFitColumns: true,
        data: null, //ko.observableArray
        columnDefs: [],
        minRowsToRender: ko.observable(1),
        maxRowWidth: ko.observable(120)
    },

    self = this,

    $root, //this is the root element that is passed in with the binding handler
    $headerContainer,
    $headerScroller,
    $headers,
    $viewport,
    $canvas,
    $footerContainer,
    $footers,

    viewportH, viewportW,

    //scrolling
    prevScrollTop, prevScrollLeft;

    this.config = $.extend(defaults, options)
    this.gridId = kg.utils.newId();

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;
    this.filteredData = ko.computed(function () {

        //TODO: build out filtering
        return self.data();
    });
    this.maxRows = ko.computed(function () {
        rows = self.filteredData();
        return rows.length || 0;
    });

    this.columns = new kg.ColumnCollection();

    //initialized in the init method
    this.rowManager;
    this.rows;

    this.headerRow;


    this.update = function (rootDomNode) {
        //build back the DOM variables
        updateDomStructure(rootDomNode);

        measureDomConstraints();

        calculateConstraints();

        self.rowManager.viewableRange(new kg.Range(0, self.config.minRowsToRender()));
    };

    var updateDomStructure = function (rootDomNode) {

        $root = $(rootDomNode);

        // the 'with' binding blows away everything except the inner html, so rebuild it

        //Headers
        $headerContainer = $(".kgHeaderContainer", $root[0]);
        $headerScroller = $(".kgHeaderScroller", $headerContainer[0]);
        $headers = $headerContainer.children();

        //Viewport
        $viewport = $(".kgViewport", $root[0]);

        //Canvas
        $canvas = $(".kgCanvas", $viewport[0]);

        //Footers
        $footerContainer = $(".kgFooterContainer", $root[0]);
        $footers = $footerContainer.children();
    };

    var measureDomConstraints = function () {
        //pop the canvas, so we can measure the attributes
        $canvas.height(100000); //pretty large, so the scroll bars, etc.. should open up

        viewportH = $root.height() - self.config.headerRowHeight;

        viewportW = $root.width();

        $viewport.height(viewportH);

        $viewport.width(viewportW);
        $headerScroller.width(self.config.maxRowWidth);
    };

    var calculateConstraints = function () {

        //figure out how many rows to render in the viewport based upon the viewable height
        self.config.minRowsToRender(Math.floor(viewportH / self.config.rowHeight));

    };

    var buildColumnDefsFromData = function () {
        var item = self.data()[0];

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

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.offsetLeft(i * self.config.columnWidth);
                column.width(colDef.width || self.config.columnWidth);

                rowWidth += column.width(); //sum this up

                //setup the max col width observable
                column.offsetRight = ko.computed(function () {
                    var maxWidth = self.config.maxRowWidth(),
                        offsetRight;

                    offsetRight = maxWidth - column.offsetLeft();
                    return offsetRight - column.width();
                });

                self.columns.push(column);
            });

            self.config.maxRowWidth(rowWidth);
        }
    };

    this.init = function () {

        buildColumns();

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable
    };

    this.registerEvents = function () {
        $viewport.scroll(handleScroll);
    };

    var handleScroll = function (e) {
        var scrollTop = e.target.scrollTop,
            scrollLeft = e.target.scrollLeft,
            rowIndex;

        $headerScroller.scrollLeft(scrollLeft);

        if (prevScrollTop === scrollTop) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.config.minRowsToRender()));

    };
};