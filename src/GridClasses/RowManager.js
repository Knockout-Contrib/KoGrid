kg.RowManager = function (grid) {
    var self = this,
        prevMaxRows = 0, // for comparison purposes when scrolling
        prevMinRows = 0, // for comparison purposes when scrolling
        dataChanged = true, // flag to determine if the dataSource has been sorted, filtered, or updated
        currentPage = grid.config.currentPage,
        pageSize = grid.config.pageSize,
        prevRenderedRange = new kg.Range(0, 1), // for comparison purposes to help throttle re-calcs when scrolling
        prevViewableRange = new kg.Range(0, 1), // for comparison purposes to help throttle re-calcs when scrolling
        internalRenderedRange = ko.observable(prevRenderedRange); // for comparison purposes to help throttle re-calcs when scrolling
    
     // we cache rows when they are built, and then blow the cache away when sorting/filtering
    self.rowCache = []
    // short cut to sorted and filtered data
    this.dataSource = grid.finalData; //observableArray

    // change subscription to clear out our cache
    this.dataSource.subscribe(function () {
        dataChanged = true;
        self.rowCache = []; //if data source changes, kill this!
    });

    // shortcut to the calculated minimum viewport rows
    this.minViewportRows = grid.minRowsToRender; //observable

    // the # of rows we want to add to the top and bottom of the rendered grid rows 
    this.excessRows = 8;

    // height of each row
    this.rowHeight = grid.config.rowHeight;

    // the logic that builds cell objects
    this.cellFactory = new kg.CellFactory(grid.columns());

    // the actual range the user can see in the viewport
    this.viewableRange = ko.observable(prevViewableRange);

    // the range of rows that we actually render on the canvas ... essentially 'viewableRange' + 'excessRows' on top and bottom
    this.renderedRange = ko.observable(prevRenderedRange);

    // the array of rows that we've rendered
    this.rows = ko.observableArray([]);

    // change handler subscriptions for disposal purposes (used heavily by the 'rows' binding)
    this.rowSubscriptions = {};

    // Builds rows for each data item in the 'dataSource'
    // @entity - the data item
    // @rowIndex - the index of the row
    // @pagingOffset - the # of rows to add the the rowIndex in case server-side paging is happening
    this.buildRowFromEntity = function (entity, rowIndex, pagingOffset) {
        var row = self.rowCache[rowIndex]; // first check to see if we've already built it

        if (!row) {

            // build the row
            row = new kg.Row(entity, grid.config, self.rowCache);
            row.rowIndex = rowIndex + 1; //not a zero-based rowIndex
            row.rowDisplayIndex = row.rowIndex + pagingOffset;
            row.offsetTop = self.rowHeight * rowIndex;

            //build out the cells
            self.cellFactory.buildRowCells(row);

            // finally cache it for the next round
            self.rowCache[rowIndex] = row;
        }

        return row;
    };

    // core logic here - anytime we updated the renderedRange, we need to update the 'rows' array 
    this.renderedRange.subscribe(function (rg) {
        var rowArr = [],
            row,
            pagingOffset = (pageSize() * (currentPage() - 1)),
            dataArr = self.dataSource().slice(rg.bottomRow, rg.topRow);

        utils.forEach(dataArr, function (item, i) {
            row = self.buildRowFromEntity(item, rg.bottomRow + i, pagingOffset);
            item.myRowEntity = row;
            //add the row to our return array
            rowArr.push(row);

            //null the row pointer for next iteration
            row = null;
        });

        self.rows(rowArr);
    });

    // core logic that intelligently figures out the rendered range given all the contraints that we have
    this.calcRenderedRange = function () {
        var rg = self.viewableRange(),
            minRows = self.minViewportRows(),
            maxRows = self.dataSource().length,
            isDif = false, // flag to help us see if the viewableRange or data has changed "enough" to warrant re-building our rows
            newRg; // variable to hold our newly-calc'd rendered range 

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

                // now build the new rendered range
                newRg = new kg.Range(rg.bottomRow, rg.topRow);

                // make sure we are within our data constraints (can't render negative rows or rows greater than the # of data items we have)
                newRg.bottomRow = Math.max(0, rg.bottomRow - self.excessRows);
                newRg.topRow = Math.min(maxRows, rg.topRow + self.excessRows);

                // store them for later comparison purposes
                prevMaxRows = maxRows;
                prevMinRows = minRows;

                //one last equality check
                if (prevRenderedRange.topRow !== newRg.topRow || prevRenderedRange.bottomRow !== newRg.bottomRow || dataChanged) {
                    dataChanged = false;
                    prevRenderedRange = newRg;

                    // now kickoff row building
                    self.renderedRange(newRg);
                }
            }
        } else {
            self.renderedRange(new kg.Range(0, 0));
        }
    };

    // make sure that if any of these change, we re-fire the calc logic
    self.viewableRange.subscribe(self.calcRenderedRange);
    self.minViewportRows.subscribe(self.calcRenderedRange);
    self.dataSource.subscribe(self.calcRenderedRange);
};