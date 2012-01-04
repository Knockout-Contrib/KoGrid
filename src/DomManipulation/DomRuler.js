kg.DOMRuler = (function () {

    var buildOutFakeGrid = function (grid) {

    };

    var measureHeaderRow = function (grid) {
        var headerRow = new kg.HeaderRow(),
            $dummyHeader = $('<div></div>');

        kg.domFormatter.formatHeaderRow($('<div></div>')[0]);
    };

    var measureHeaderCell = function (grid) {

    };

    var measureViewport = function (grid) {

    };

    var measureCanvas = function (grid) {

    };

    var measureRow = function (grid) {

    };

    var measureCell = function (grid) {

    };

    return {

        measureGrid: function (grid) {

            buildOutFakeGrid(grid);
            measureHeaderRow(grid);
            measureHeaderCell(grid);
            measureViewport(grid);
            measureCanvas(grid);
            measureRow(grid);
            measureCell(grid);

        }
    };
} ());