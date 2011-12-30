/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 25,
        columnWidth: 80,
        headerRowHeight: 35,
        rowTemplate: null,
        headerTemplate: null,
        footerTemplate: null,
        gridCssClass: 'koGrid',
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: []
    },

    config = $.extend(defaults, options),
    self = this,

    $root, //this is the root element that is passed in with the binding handler
    $headerContainer,
    $headers,
    $viewport,
    $canvas,
    $footerContainer,
    $footers,

    viewportH, viewportW;

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = config.data;
    this.filteredData = ko.computed(function () {

        //TODO: build out filtering
        return self.data();
    });


    this.columns = new kg.ColumnCollection();

    //initialized in the init method
    this.rowManager;
    this.rows;

    var buildDomStructure = function (rootDomNode) {
        $root = $(rootDomNode);
        $root.empty();

        $root.css("position", "relative");

        //Headers
        $headerContainer = $('<div class="kgHeaderContainer" style="position: relative;"></div>').appendTo($root);

        //Viewport
        $viewport = $('<div class="kgViewport" style="overflow: auto;"></div>').appendTo($root);

        //Canvas
        $canvas = $('<div class="kgCanvas" style="position: relative;" data-bind="koGridRows: $data"></div>').appendTo($viewport);

        //Footers
        $footerContainer = $('<div class="kgFooterContainer"></div>').appendTo($root);
    };

    var measureDomConstraints = function () {

        viewportH = $viewport.height();
        viewportW = $viewport.width();

    };

    var calculateConstraints = function () {

        //figure out how many rows to render in the viewport based upon the viewable height
        minRowsToRender = Math.floor(viewportH / config.rowHeight);

    };

    var buildColumnDefsFromData = function () {
        var item = self.data()[0];

        utils.forIn(item, function (prop, propName) {

            config.columnDefs.push({
                field: propName
            });
        });

    };

    var buildColumns = function () {
        var columnDefs = config.columnDefs,
            column;

        if (config.autogenerateColumns) { buildColumnDefsFromData(); }

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.offsetLeft = i * config.columnWidth;
                column.width(config.columnWidth);

                self.columns.push(column);
            });
        }
    };

    var buildHeaders = function () {

        $headers = $('<div class="kgHeaderRow"></div>').appendTo($headerContainer);

        utils.forEach(self.columns(), function (col, i) {

            $('<div></div>').text(col.field)
                            .css("position", "absolute")
                            .css("left", col.offsetLeft)
                            .css("top", 0)
                            .width(col.width())
                            .appendTo($headers);
        });
    };

    this.init = function (rootDomNode) {

        buildDomStructure(rootDomNode);
        measureDomConstraints();
        calculateConstraints();
        buildColumns();
        buildHeaders();

        self.rowManager = new kg.RowManager(self.columns(), self.filteredData, $canvas);
        self.rowManager.minViewportRows = minRowsToRender;
        self.rowManager.rowHeight = config.rowHeight;

        self.rows = self.rowManager.rows; // dependent observable

    };
};