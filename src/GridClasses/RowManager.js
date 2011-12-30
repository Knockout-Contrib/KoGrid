kg.RowManager = function (cols, dataSource, canvas, config) {
    var self = this,
        rowCache = {},
        maxRows = dataSource().length;

    this.colCache = cols;
    this.rowElCache = [];
    this.$canvas = canvas;
    this.rowTemplateId = config.rowTemplate;
    this.dataSource = dataSource; //observable
    this.minViewportRows = 0;
    this.excessRows = 5;
    this.rowHeight = config.rowHeight;
    this.cellFactory = new kg.CellFactory(cols);
    this.viewableRange = ko.observable(new kg.Range(0, 1));
    this.renderedRange = ko.computed(function () {
        var rg = self.viewableRange();

        if (rg) {
            rg.topRow = rg.bottomRow + self.minViewportRows; //make sure we have the correct number of rows rendered

            rg.bottomRow = Math.max(0, rg.bottomRow - self.excessRows);
            rg.topRow = Math.min(maxRows, rg.topRow + self.excessRows);

            return rg;
        } else {
            return new kg.Range(0, 0);
        }
    });

    var buildRowFromEntity = function (entity, rowIndex) {
        var row = rowCache[rowIndex];

        if (!row) {

            row = new kg.Row();
            row.rowIndex = rowIndex;
            row.height(self.rowHeight);
            row.offsetTop = self.rowHeight * rowIndex;
            row.entity(entity);

            self.cellFactory.buildRowCells(row);

            rowCache[rowIndex] = row;
        }

        return row;
    };

    //Very special - when this fires, it also renders the DOM elements
    this.rows = ko.computed(function () {
        var rg = self.renderedRange(),
            rowArr = [],
            row,
            dataArr = self.dataSource().slice(rg.bottomRow, rg.topRow);


        utils.forEach(dataArr, function (item, i) {
            row = buildRowFromEntity(item, rg.bottomRow + i);
            rowArr.push(row);
        });

        return rowArr;
    });

    this.nonRenderedRows = ko.computed(function () {
        return ko.utils.arrayFilter(self.rows(), function (row) {
            return !self.rowElCache[row.rowIndex];
        });
    });

};