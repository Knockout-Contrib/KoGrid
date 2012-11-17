/// <reference path="Aggregate.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
/// <reference path="../constants.js" />
/// <reference path="../namespace.js" />
kg.RowManager = function (grid) {
    var self = this,
        prevMaxRows = 0, // for comparison purposes when scrolling
        prevMinRows = 0, // for comparison purposes when scrolling
        currentPage = grid.config.currentPage,
        pageSize = grid.config.pageSize,
        prevRenderedRange = new kg.Range(0, 1), // for comparison purposes to help throttle re-calcs when scrolling
        prevViewableRange = new kg.Range(0, 1), // for comparison purposes to help throttle re-calcs when scrolling
        parents = []; // Used for grouping and is cleared each time groups are calulated.

    this.dataChanged = true;
     // we cache rows when they are built, and then blow the cache away when sorting/filtering
    this.rowCache = [];
    this.aggCache = {};
    // short cut to sorted and filtered data
    this.dataSource = grid.finalData; //observableArray
    // change subscription to clear out our cache
    this.dataSource.subscribe(function () {
        self.dataChanged = true;
        self.rowCache = []; //if data source changes, kill this!
    });
    // shortcut to the calculated minimum viewport rows
    this.minViewportRows = grid.minRowsToRender; //observable
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
            row = new kg.Row(entity, grid.config, grid.selectionManager);
            row.rowIndex = rowIndex + 1; //not a zero-based rowIndex
            row.rowDisplayIndex = row.rowIndex + pagingOffset;
            row.offsetTop = self.rowHeight * rowIndex;
            //build out the cells
            self.cellFactory.buildRowCells(row);
            // finally cache it for the next round
            self.rowCache[rowIndex] = row;
        }
        // store the row's index on the entity for future ref
        entity[ROW_KEY] = rowIndex;
        return row;
    };

    self.buildAggregateRow = function (aggEntity, rowIndex) {
        var agg = self.aggCache[aggEntity.aggIndex]; // first check to see if we've already built it 
        if (!agg) {
            // build the row
            agg = new kg.Aggregate(aggEntity, self);
            self.aggCache[aggEntity.aggIndex] = agg;
        }
        agg.index = rowIndex + 1; //not a zero-based rowIndex
        agg.offsetTop = self.rowHeight * rowIndex;
        // finally cache it for the next round
        // store the row's index on the entity for future ref
        aggEntity[ROW_KEY] = rowIndex;
        return agg;
    };
    // core logic that intelligently figures out the rendered range given all the contraints that we have
    this.calcRenderedRange = function () {
        var rg = self.viewableRange(),
            minRows = self.minViewportRows(),
            maxRows = self.dataSource().length,
            isDif, // flag to help us see if the viewableRange or data has changed "enough" to warrant re-building our rows
            newRg; // variable to hold our newly-calc'd rendered range 

        if (rg) {

            isDif = (rg.bottomRow !== prevViewableRange.bottomRow || rg.topRow !== prevViewableRange.topRow || self.dataChanged);
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
                newRg.bottomRow = Math.max(0, rg.bottomRow - EXCESS_ROWS);
                newRg.topRow = Math.min(maxRows, rg.topRow + EXCESS_ROWS);
                // store them for later comparison purposes
                prevMaxRows = maxRows;
                prevMinRows = minRows;
                //one last equality check
                if (prevRenderedRange.topRow !== newRg.topRow || prevRenderedRange.bottomRow !== newRg.bottomRow || self.dataChanged) {
                    self.dataChanged = false;
                    prevRenderedRange = newRg;
                    // now kickoff row building
                    self.renderedRange(newRg);
                }
            }
        } else {
            self.renderedRange(new kg.Range(0, 0));
        }
    };

   
    self.getGrouping = function (groups) {
        self.aggCache = [];
        self.rowCache = [];
        self.numberOfAggregates = 0;
        self.groupedData = {};
        // Here we set the onmousedown event handler to the header container.
        var data = grid.sortedData;
        var maxDepth = groups.length;
        var cols = grid.columns;

        kg.utils.forEach(data, function (item) {
            var ptr = self.groupedData;
            kg.utils.forEach(groups, function (group, depth) {
                if (!cols[depth].isAggCol && depth <= maxDepth) {
                    cols.splice(item.gDepth, 0, new kg.Column({
                        colDef: {
                            field: '',
                            width: 25,
                            sortable: false,
                            resizable: false,
                            headerCellTemplate: '<div class="kgAggHeader"></div>',
                        },
                        isAggCol: true,
                        index: item.gDepth,
                        headerRowHeight: grid.config.headerRowHeight
                    }));
                }
                var col = cols.filter(function (c) {
                    return c.field == group;
                })[0];
                var val = item[group].toString();
                if (!ptr[val]) {
                    ptr[val] = {};
                }
                if (!ptr[NG_FIELD]) {
                    ptr[NG_FIELD] = group;
                }
                if (!ptr[NG_DEPTH]) {
                    ptr[NG_DEPTH] = depth;
                }
                if (!ptr[NG_COLUMN]) {
                    ptr[NG_COLUMN] = col;
                }
                ptr = ptr[val];
            });
            if (!ptr.values) {
                ptr.values = [];
            }
            item[NG_HIDDEN] = true;
            ptr.values.push(item);
        });
        grid.fixColumnIndexes();
        grid.cssBuilder.buildStyles();
    };

    self.parsedData = { needsUpdate: true, values: [] };

    // core logic here - anytime we updated the renderedRange, we need to update the 'rows' array 
    this.renderedChangeNoGroups = function (rg) {
        var rowArr = [],
            row,
            pagingOffset = (pageSize() * (currentPage() - 1)),
            dataArr = self.dataSource().slice(rg.bottomRow, rg.topRow);

        kg.utils.forEach(dataArr, function (item, i) {
            row = self.buildRowFromEntity(item, rg.bottomRow + i, pagingOffset);
            //add the row to our return array
            rowArr.push(row);
            //null the row pointer for next iteration
            row = null;
        });
        kg.utils.forEach(grid.config.plugins, function (p) {
            p.onRowsChanged(grid, rowArr);
        });
        self.rows(rowArr);
    };
    
    self.renderedRange.subscribe(function (rg) {
        if (grid.config.groups.length < 1) {
            self.renderedChangeNoGroups(rg);
            return;
        }
        var rowArr = [];
        parents = [];
        if (self.parsedData.needsUpdate) {
            self.parsedData.values.length = 0;
            self.parseGroupData(self.groupedData);
            self.parsedData.needsUpdate = false;
        }
        var dataArray = self.parsedData.values.filter(function (e) {
            return e[NG_HIDDEN] === false;
        }).slice(self.renderedRange.bottomRow, self.renderedRange.topRow);
        kg.utils.forEach(dataArray, function (item, indx) {
            var row;
            if (item.isAggRow) {
                row = self.buildAggregateRow(item, self.renderedRange.bottomRow + indx);
            } else {
                row = self.buildEntityRow(item, self.renderedRange.bottomRow + indx);
            }
            //add the row to our return array
            rowArr.push(row);
        });
        grid.setRenderedRows(rowArr);
        grid.refreshDomSizes();
    });

    //magical recursion. it works. I swear it.
    self.parseGroupData = function (g) {
        if (g.values) {
            kg.utils.forEach(g.values, function (item) {
                // get the last parent in the array because that's where our children want to be
                parents[parents.length - 1].children.push(item);
                //add the row to our return array
                self.parsedData.values.push(item);
            });
        } else {
            for (var prop in g) {
                // exclude the meta properties.
                if (prop == NG_FIELD || prop == NG_DEPTH || prop == NG_COLUMN) {
                    continue;
                } else if (g.hasOwnProperty(prop)) {
                    //build the aggregate row
                    var agg = self.buildAggregateRow({
                        gField: g[NG_FIELD],
                        gLabel: prop,
                        gDepth: g[NG_DEPTH],
                        isAggRow: true,
                        '_ng_hidden_': false,
                        children: [],
                        aggChildren: [],
                        aggIndex: self.numberOfAggregates++,
                        aggLabelFilter: g[NG_COLUMN].aggLabelFilter
                    }, 0);
                    //set the aggregate parent to the parent in the array that is one less deep.
                    agg.parent = parents[agg.depth - 1];
                    // if we have a parent, set the parent to not be collapsed and append the current agg to its children
                    if (agg.parent) {
                        agg.parent.collapsed = false;
                        agg.parent.aggChildren.push(agg);
                    }
                    // add the aggregate row to the parsed data.
                    self.parsedData.values.push(agg.entity);
                    // the current aggregate now the parent of the current depth
                    parents[agg.depth] = agg;
                    // dig deeper for more aggregates or children.
                    self.parseGroupData(g[prop]);
                }
            }
        }
    };
    // make sure that if any of these change, we re-fire the calc logic
    self.viewableRange.subscribe(self.calcRenderedRange);
    self.minViewportRows.subscribe(self.calcRenderedRange);
    self.dataSource.subscribe(self.calcRenderedRange);
};