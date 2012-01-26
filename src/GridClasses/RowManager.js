kg.RowManager = function (grid) {
    var self = this,
        rowCache = {},
        prevMaxRows = 0,
        prevMinRows = 0,
        prevRenderedRange = new kg.Range(0, 1),
        prevViewableRange = new kg.Range(0, 1),
        internalRenderedRange = ko.observable(prevRenderedRange);

    this.dataSource = grid.finalData; //observableArray
    this.dataSource.subscribe(function () {
        prevRenderedRange = new kg.Range(0, 1);
        prevViewableRange = new kg.Range(0, 1);
        rowCache = {}; //if data source changes, kill this!
    });
    this.minViewportRows = grid.minRowsToRender; //observable
    this.excessRows = 8;
    this.rowHeight = grid.config.rowHeight;
    this.cellFactory = new kg.CellFactory(grid.columns());
    this.viewableRange = ko.observable(new kg.Range(0, 1));
    this.rows = ko.observableArray([]);

    var buildRowFromEntity = function (entity, rowIndex) {
        var row = rowCache[rowIndex];

        if (!row) {

            row = new kg.Row(entity);
            row.rowIndex = rowIndex + 1; //not a zero-based rowIndex
            row.offsetTop = self.rowHeight * rowIndex;
            row.onSelectionChanged = function () {
                var ent = this.entity();

                grid.changeSelectedItem(ent);
            };
            self.cellFactory.buildRowCells(row);

            rowCache[rowIndex] = row;
        }

        return row;
    };

    internalRenderedRange.subscribe(function (rg) {
        var rowArr = [],
            row,
            dataArr = self.dataSource().slice(rg.bottomRow, rg.topRow);

        utils.forEach(dataArr, function (item, i) {
            row = buildRowFromEntity(item, rg.bottomRow + i);
            rowArr.push(row);
        });

        self.rows(rowArr);
    });

    this.renderedRange = ko.computed(function () {
        var rg = self.viewableRange(),
            minRows = self.minViewportRows(),
            maxRows = self.dataSource().length,
            isDif = false;

        if (rg) {

            isDif = (rg.bottomRow !== prevViewableRange.bottomRow || rg.topRow !== prevViewableRange.topRow)
            if (!isDif && prevMaxRows !== maxRows) {
                isDif = true;
                rg = prevViewableRange;
            }

            if (!isDif && prevMinRows !== minRows) {
                isDif = true;
                rg = prevViewableRange;
            }

            if (isDif) {

                //Now build out the new rendered range
                rg.topRow = rg.bottomRow + minRows;

                prevViewableRange.bottomRow = rg.bottomRow;
                prevViewableRange.topRow = rg.topRow;

                rg.bottomRow = Math.max(0, rg.bottomRow - self.excessRows);
                rg.topRow = Math.min(maxRows, rg.topRow + self.excessRows);

                prevMaxRows = maxRows;
                prevMinRows = minRows;

                //one last equality check
                if (prevRenderedRange.topRow !== rg.topRow || prevRenderedRange.bottomRow !== rg.bottomRow) {
                    prevRenderedRange = rg;
                    internalRenderedRange(rg);
                }
            }
        } else {
            internalRenderedRange(new kg.Range(0, 0));
        }
    });
};