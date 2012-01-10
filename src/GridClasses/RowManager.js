kg.RowManager = function (grid) {
    var self = this,
        rowCache = {},
        prevMaxRows = 0,
        prevRenderedRange = new kg.Range(0, 1);

    this.rowTemplateId = grid.config.rowTemplate;
    this.dataSource = grid.filteredData; //observable
    this.dataSource.subscribe(function () {
        rowCache = {}; //if data source changes, kill this!
    });
    this.minViewportRows = grid.minRowsToRender;
    this.excessRows = 5;
    this.rowHeight = grid.config.rowHeight;
    this.cellFactory = new kg.CellFactory(grid.columns());
    this.viewableRange = ko.observable(new kg.Range(0, 1));

    this.renderedRange = ko.computed(function () {
        var rg = self.viewableRange(),
            minRows = self.minViewportRows(),
            maxRows = self.dataSource().length,
            isDif = false;

        if (rg) {

            isDif = (rg.bottomRow !== prevRenderedRange.bottomRow || rg.topRow !== prevRenderedRange.topRow)
            if (!isDif && prevMaxRows !== maxRows) {
                isDif = true;
            }

            if (isDif) {
                rg.topRow = rg.bottomRow + minRows; //make sure we have the correct number of rows rendered

                rg.bottomRow = Math.max(0, rg.bottomRow - self.excessRows);
                rg.topRow = Math.min(maxRows, rg.topRow + self.excessRows);

                prevRenderedRange = rg;
            }
            return prevRenderedRange;
        } else {
            return new kg.Range(0, 0);
        }
    });

    var buildRowFromEntity = function (entity, rowIndex) {
        var row = rowCache[rowIndex];

        if (!row) {

            row = new kg.Row(entity);
            row.rowIndex = rowIndex + 1; //not a zero-based rowIndex
            row.height = ko.computed(function () {
                return grid.config.rowHeight;
            });
            row.offsetTop = self.rowHeight * rowIndex;

            row.onSelectionChanged = function () {
                grid.selectedItemChanged(this.entity());
            };

            self.cellFactory.buildRowCells(row);

            rowCache[rowIndex] = row;
        }

        return row;
    };

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
};