kg.RowManager = function (cols, dataSource, canvas) {
    var self = this,
        rowCache = {},
        rowElCache = [], //yes, an array
        maxRows = dataSource().length;

    this.colCache = cols;
    this.$canvas = canvas;
    this.dataSource = dataSource; //observable
    this.minViewportRows = 0;
    this.excessRows = 5;
    this.rowHeight = 25;
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

    var appendRow = function (row) {
        var rowEl;

        if (!rowElCache[row.rowIndex]) {

            rowEl = document.createElement('DIV');

            rowEl.style = "position: absolute;";
            rowEl.height = row.height();
            rowEl.top = row.offsetTop;

            rowEl.innerHTML = '<span>Hi</span>';
            rowElCache[row.rowIndex] = rowEl;
            self.$canvas[0].appendChild(rowEl);
        }
    };

    var cleanupCanvas = function () {
        var rg = self.renderedRange(),
            rowEl,
            len = rowElCache.length,
            i = 0;

        while (i < rg.bottomRow) {

            rowEl = rowElCache[i];
            if (rowEl) {
                ko.utils.domNodeDisposal.removeNode(rowEl);
            }
            i++;
        }

        i = rg.topRow++;

        while (i < len) {

            rowEl = rowElCache[i];
            if (rowEl) {
                ko.utils.domNodeDisposal.removeNode(rowEl);
            }
            i++;
        }
    };

    //Very special - when this fires, it also renders the DOM elements
    this.rows = ko.computed(function () {
        var rg = self.renderedRange(),
            rowArr = [],
            row,
            dataArr = self.dataSource().slice(rg.bottomRow, rg.topRow);

        cleanupCanvas();

        utils.forEach(dataArr, function (item, i) {
            row = buildRowFromEntity(item, rg.bottomRow + i);
            appendRow(row);
            rowArr.push(row);
        });


        return rowArr;
    });


};