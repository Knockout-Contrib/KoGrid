kg.RowManager = function (grid) {
    var self = this,
        rowCache = {},
        prevMaxRows = 0,
        prevMinRows = 0,
        dataChanged = false,
        currentPage = grid.config.currentPage,
        pageSize = grid.config.pageSize,
        prevRenderedRange = new kg.Range(0, 1),
        prevViewableRange = new kg.Range(0, 1),
        internalRenderedRange = ko.observable(prevRenderedRange);

    this.dataSource = grid.finalData; //observableArray
    this.dataSource.subscribe(function () {
        dataChanged = true;
        rowCache = {}; //if data source changes, kill this!
    });
    this.minViewportRows = grid.minRowsToRender; //observable
    this.excessRows = 8;
    this.rowHeight = grid.config.rowHeight;
    this.cellFactory = new kg.CellFactory(grid.columns());
    this.viewableRange = ko.observable(prevViewableRange);
    this.renderedRange = ko.observable(prevRenderedRange);
    this.rows = ko.observableArray([]);
    this.rowSubscriptions = {};

    var buildRowFromEntity = function (entity, rowIndex, pagingOffset) {
        var row = rowCache[rowIndex];

        if (!row) {

            row = new kg.Row(entity);
            row.rowIndex = rowIndex + 1; //not a zero-based rowIndex
            row.rowDisplayIndex = row.rowIndex + pagingOffset;
            row.offsetTop = self.rowHeight * rowIndex;

            //setup a selection change handler
            row.onSelectionChanged = function () {
                var ent = this.entity();
                grid.changeSelectedItem(ent);
            };

            //build out the cells
            self.cellFactory.buildRowCells(row);

            rowCache[rowIndex] = row;
        }

        return row;
    };

    this.renderedRange.subscribe(function (rg) {
        var rowArr = [],
            row,
            pagingOffset = (pageSize() * (currentPage() - 1)),
            dataArr = self.dataSource().slice(rg.bottomRow, rg.topRow);

        utils.forEach(dataArr, function (item, i) {
            row = buildRowFromEntity(item, rg.bottomRow + i, pagingOffset);

            //add the row to our return array
            rowArr.push(row);

            //null the row pointer for next iteration
            row = null;
        });

        self.rows(rowArr);
    });

    var calcRenderedRange = function () {
        var rg = self.viewableRange(),
            minRows = self.minViewportRows(),
            maxRows = self.dataSource().length,
            isDif = false,
            newRg;

        if (rg) {

            isDif = (rg.bottomRow !== prevViewableRange.bottomRow || rg.topRow !== prevViewableRange.topRow || dataChanged)
            if (!isDif && prevMaxRows !== maxRows) {
                isDif = true;
                rg = new kg.Range(prevViewableRange.bottomRow, prevViewableRange.topRow);
            }

            if (!isDif && prevMinRows !== minRows) {
                isDif = true;
                rg = new kg.Range(prevViewableRange.bottomRow, prevViewableRange.topRow);
            }

            if (isDif) {
                //Now build out the new rendered range
                rg.topRow = rg.bottomRow + minRows;

                //store it for next rev
                prevViewableRange = rg;

                newRg = new kg.Range(rg.bottomRow, rg.topRow);

                newRg.bottomRow = Math.max(0, rg.bottomRow - self.excessRows);
                newRg.topRow = Math.min(maxRows, rg.topRow + self.excessRows);

                prevMaxRows = maxRows;
                prevMinRows = minRows;

                //one last equality check
                if (prevRenderedRange.topRow !== newRg.topRow || prevRenderedRange.bottomRow !== newRg.bottomRow || dataChanged) {
                    dataChanged = false;
                    prevRenderedRange = newRg;
                    self.renderedRange(newRg);
                }
            }
        } else {
            self.renderedRange(new kg.Range(0, 0));
        }
    };

    self.viewableRange.subscribe(calcRenderedRange);
    self.minViewportRows.subscribe(calcRenderedRange);
    self.dataSource.subscribe(calcRenderedRange);
};