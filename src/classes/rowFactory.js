/// <reference path="domUtilityService.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
/// <reference path="../utils.js" />
/// <reference path="../namespace.js" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js" />
window.kg.RowFactory = function (grid) {
    var self = this;
    // we cache rows when they are built, and then blow the cache away when sorting
    self.rowCache = [];
    self.aggCache = {};
    self.parentCache = []; // Used for grouping and is cleared each time groups are calulated.
    self.dataChanged = true;
    self.parsedData = [];
    grid.config.parsedDataCache = grid.config.parsedDataCache || ko.observableArray();
    self.parsedDataCache = grid.config.parsedDataCache;
    self.rowConfig = {};
    self.selectionService = grid.selectionService;
    self.aggregationProvider = new window.kg.AggregationProvider(grid);
    self.rowHeight = 30;
    self.numberOfAggregates = 0;
    self.groupedData = undefined;
    self.rowHeight = grid.config.rowHeight;
    self.rowConfig = {
        canSelectRows: grid.config.canSelectRows,
        rowClasses: grid.config.rowClasses,
        selectedItems: grid.config.selectedItems,
        selectWithCheckboxOnly: grid.config.selectWithCheckboxOnly,
        beforeSelectionChangeCallback: grid.config.beforeSelectionChange,
        afterSelectionChangeCallback: grid.config.afterSelectionChange
    };

    self.renderedRange = new window.kg.Range(0, grid.minRowsToRender() + EXCESS_ROWS);
    // Builds rows for each data item in the 'filteredData'
    // @entity - the data item
    // @rowIndex - the index of the row
    self.buildEntityRow = function(entity, rowIndex) {
        var row = self.rowCache[rowIndex]; // first check to see if we've already built it
        if (!row) {
            // build the row
            row = new window.kg.Row(entity, self.rowConfig, self.selectionService);
            row.rowIndex(rowIndex + 1); //not a zero-based rowIndex
            row.offsetTop((self.rowHeight * rowIndex).toString() + 'px');
            // row.selected(entity[SELECTED_PROP]);
            // finally cache it for the next round
            self.rowCache[rowIndex] = row;
        }
        return row;
    };
    self.getChildCount = function (row) {
        if (row.children && row.children.length) return row.children.length;
        else if (row.aggChildren && row.aggChildren.length) {
            var total = 0;
            row.aggChildren.forEach(function (a) {
                total += self.getChildCount(a);
            });
            return total;
        }
        return 0;
    };
    self.calcAggContent = function (row, column) {
        if (column.field == 'Group') {
            return row.label();
        } else if (column.field == row.entity.gField) {
            return row.entity.gLabel;
        } else if (column.groupIndex() && row.parent) {
            if (row.parent) {
                return row.parent.entity[column.field]();
            } else {
                return '';
            }
        } else if (column.field == "lineNum") {
            return self.getChildCount(row);
        } else {
            var def = column.config.colDef;
            //TODO: add a switch for whether or not to aggregate at all.
            if (def && (def.aggregator || def.agg)) {
                var aggType = def.agg || def.aggregator || 'count';
                var aggParts = aggType.match(/^([^(]+)\(([^)]+)?\)/);
                if (aggParts) {
                    aggType = aggParts[1];
                }
                var aggregator = self.aggregationProvider[aggType];
                if (aggParts && typeof aggregator == "function") {
                    aggregator = aggregator(aggParts[2]);
                }
                if (!aggregator || typeof aggregator.grid != "function") return "#error";
                var aggregateValue = aggregator.grid(row, def);
                return aggregateValue ? aggregateValue : '';
            }

            console.log('No way to calc agg content');
            return '';
        }
    };
    self.getAggKey = function (aggRow) {
        var key = {};
        key[aggRow.entity.gField] = aggRow.entity.gLabel;
        if (aggRow.parent) {
            key = $.extend(key, self.getAggKey(aggRow.parent));
        }
        return key;
    };
    self.buildAggregateEntity = function (agg) {
        var aggEntity = agg.entity;
        grid.nonAggColumns().forEach(function (column) {
            aggEntity[column.field] = ko.computed({
                read: function () {
                    if (!this.val) this.val = self.calcAggContent(agg, column);
                    return this.val;
                },
                owner: {},
                deferEvaluation: true
            });
            // if (result.field == column.field) result.setExpand
        });
        agg.Key = aggEntity.Key = self.getAggKey(agg);
    };
    self.buildAggregateRow = function(aggEntity, rowIndex) {
        var agg = self.aggCache[aggEntity.aggIndex]; // first check to see if we've already built it 
        if (!agg) {
            // build the row
            agg = new window.kg.Aggregate(aggEntity, self.rowConfig, self, self.selectionService);
            self.aggCache[aggEntity.aggIndex] = agg;
        }
        agg.index = rowIndex + 1; //not a zero-based rowIndex
        agg.offsetTop((self.rowHeight * rowIndex).toString() + 'px');
        self.rowCache[rowIndex] = agg;
        return agg;
    };
    self.UpdateViewableRange = function(newRange) {
        self.renderedRange = newRange;
        self.renderedChange();
    };
    self.filteredDataChanged = function() {
        // check for latebound autogenerated columns
        if (grid.lateBoundColumns && grid.filteredData().length > 1) {
            grid.config.columnDefs = undefined;
            grid.buildColumns();
            grid.lateBoundColumns = false;
        }
        self.dataChanged = true;
        self.rowCache = []; //if data source changes, kill this!
        grid.selectedCells(grid.selectedCells().filter(function (a) {
            // Cell selection might include aggregate rows, 
            // we need to remove those.
            return grid.filteredData().indexOf(a.entity) != -1;
        }));
        if (grid.config.groups.length > 0) {
            if (!grid.columns().filter(function (a) {
                return a.field == 'Group';
            }).length) {
                    grid.columns.splice(0, 0, new window.kg.Column({
                        colDef: {
                            field: 'Group',
                            displayName: grid.config.columnDefs
                            .filter(function (a) {
                                return a.groupIndex > 0;
                            })
                            .map(function (a) {
                                return a.displayName;
                            })
                            .join("-"),
                            width: 250,
                            sortable: true,
                            resizable: true
                        },
                        sortCallback: grid.sortData, 
                        resizeOnDataCallback: grid.resizeOnData,
                        enableResize: grid.config.enableColumnResize,
                        enableSort: grid.config.enableSorting,
                        index: 0,
                    }, grid));
                    window.kg.domUtilityService.BuildStyles(grid);

            }
            self.getGrouping(grid.config.groups);
        }

        var aggRow = new window.kg.Aggregate(
                {
                    isAggRow: true,
                    '_kg_hidden_': false,
                    children: [],
                    aggChildren: []
                }, // entity
                self.rowConfig,
                self,
                self.selectionService
            );
        self.buildAggregateEntity(aggRow);
        aggRow.children = grid.filteredData();
        grid.totalsRow(aggRow);
        self.UpdateViewableRange(self.renderedRange);
    };

    self.renderedChange = function() {
        if (!self.groupedData || grid.config.groups.length < 1) {
            self.renderedChangeNoGroups();
            grid.refreshDomSizes();
            return;
        }
        self.parentCache = [];
        var rowArr = [];
        var dataArray = self.parsedData.filter(function(e) {
            return e[KG_HIDDEN] === false;
        }).slice(self.renderedRange.topRow, self.renderedRange.bottomRow);
        var indexArray = self.parsedData.filter(function (a) {
            return /*a[KG_HIDDEN] === false && */!a.isAggRow;
        });
        $.each(dataArray, function (indx, item) {
            var row;
            if (item.isAggRow) {
                row = self.buildAggregateRow(item, self.renderedRange.topRow + indx);
            } else {
                item.lineNum = indexArray.indexOf(item) + 1;
                row = self.buildEntityRow(item, self.renderedRange.topRow + indx);
            }
            //add the row to our return array
            rowArr.push(row);
        });
        grid.setRenderedRows(rowArr);
        grid.refreshDomSizes();
    };

    self.renderedChangeNoGroups = function() {
        var rowArr = [];
        var dataArr = grid.filteredData.slice(self.renderedRange.topRow, self.renderedRange.bottomRow);
        var indexArray = ko.utils.unwrapObservable(grid.filteredData);
        // .filter(function (a) {
        //     return a[KG_HIDDEN] === false && !a.isAggRow;
        // });
        $.each(dataArr, function (i, item) {
            item.lineNum = indexArray.indexOf(item) + 1;
            var row = self.buildEntityRow(item, self.renderedRange.topRow + i);
            //add the row to our return array
            rowArr.push(row);
        });
        grid.setRenderedRows(rowArr);
    };

    //magical recursion. it works. I swear it. I figured it out in the shower one day.
    self.parseGroupData = function(g) {
        if (g.values) {
            $.each(g.values, function (i, item) {
                // get the last parent in the array because that's where our children want to be
                var parent = self.parentCache[self.parentCache.length - 1];
                parent.children.push(item);
                //add the row to our return array
                self.parsedData.push(item);
                // set the visability of this row
                item[KG_HIDDEN] = !!parent.collapsed();
            });
        } else {
            var props = [];
            for (var prop in g) {
                if (g[prop] && typeof g[prop] == "object" && typeof g[prop][KG_SORTINDEX] != "undefined") {
                    props[g[prop][KG_SORTINDEX]] = prop;
                }
            }
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (!prop) continue;
                // exclude the meta properties.
                if (prop == KG_FIELD || prop == KG_DEPTH || prop == KG_COLUMN || prop == KG_SORTINDEX) {
                    continue;
                } else if (g.hasOwnProperty(prop)) {
                    var field = g[KG_FIELD],
                        label = g[prop][KG_VALUE],
                        depth = g[KG_DEPTH];
                    var entity = self.parsedDataCache().filter(function (a) {
                        return  a.gField == field &&
                                a.gLabel == label &&
                                a.gDepth == depth;
                    })[0];
                    if (!entity) {
                        entity = {
                            gField: field,
                            gLabel: label,
                            gDepth: depth,
                            isAggRow: true,
                            '_kg_hidden_': false
                        };
                        self.parsedDataCache().push(entity);
                    }
                    entity.children = [];
                    entity.aggChildren = [];
                    entity.aggIndex = self.numberOfAggregates;
                    entity.aggLabelFilter = g[KG_COLUMN].aggLabelFilter;
                    var agg = self.buildAggregateRow(entity, 0);
                        agg.collapsed(agg.entity._kg_collapsed);
                    self.numberOfAggregates++;
                    //set the aggregate parent to the parent in the array that is one less deep.
                    agg.parent = self.parentCache[agg.depth - 1];
                    // if we have a parent, set the parent to not be collapsed and append the current agg to its children
                    if (agg.parent) {
                        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! I changed this
                        //agg.parent.collapsed(true);
                        agg._kg_hidden_ = agg.parent.collapsed();
                        agg.parent.aggChildren.push(agg);
                    }
                    agg.entity.Key = self.getAggKey(agg);
                    // add the aggregate row to the parsed data.
                    self.parsedData.push(agg.entity);
                    // the current aggregate now the parent of the current depth
                    self.parentCache[agg.depth] = agg;
                    // dig deeper for more aggregates or children.
                    self.parseGroupData(g[prop]);
                    self.buildAggregateEntity(agg);
                }
            }
        }
    };
    //Shuffle the data into their respective groupings.
    self.getGrouping = function(groups) {
        self.aggCache = [];
        self.rowCache = [];
        self.numberOfAggregates = 0;
        self.groupedData = {};

        // Here we set the onmousedown event handler to the header container.
        var data = grid.filteredData();
        var maxDepth = groups.length;
        var cols = grid.columns();
        var hideChildren = !!ko.utils.unwrapObservable(grid.config.hideChildren)
        $.each(data, function (i, item) {
            item[KG_HIDDEN] = hideChildren;
            var ptr = self.groupedData;
            $.each(groups, function(depth, group) {
                if (!cols[depth].isAggCol && (depth + (hideChildren ? 2 : 0)) <= maxDepth) {
                    grid.columns.splice(item.gDepth, 0, new window.kg.Column({
                        colDef: {
                            field: '',
                            width: 25,
                            sortable: false,
                            resizable: false,
                            headerCellTemplate: '<div class="kgAggHeader"></div>',
                            cellTemplate: window.kg.aggCellTemplate()
                        },
                        isAggCol: true,
                        index: item.gDepth,
                        headerRowHeight: grid.config.headerRowHeight
                    }));
                    window.kg.domUtilityService.BuildStyles(grid);
                }
                var col = cols.filter(function (c) { return c.field == group; })[0];
                var val = window.kg.utils.evalProperty(item, group);
                if (col.cellFilter) {
                    val = col.cellFilter(val);
                }
                var childVal = val;
                val = val ? val.toString() : 'null';
                if (!ptr[val]) {
                    ptr[val] = {};
                }
                if (!ptr[KG_FIELD]) {
                    ptr[KG_FIELD] = group;
                }
                if (!ptr[KG_DEPTH]) {
                    ptr[KG_DEPTH] = depth;
                }
                if (!ptr[KG_COLUMN]) {
                    ptr[KG_COLUMN] = col;
                }
                if (!ptr[KG_SORTINDEX]) {
                    ptr[KG_SORTINDEX] = i;
                }
                ptr = ptr[val];
                if (!ptr[KG_VALUE]) ptr[KG_VALUE] = childVal;
            });
            if (!ptr[KG_SORTINDEX]) {
                ptr[KG_SORTINDEX] = i;
            }
            if (!ptr.values) {
                ptr.values = [];
            }
            ptr.values.push(item);
        });
        grid.fixColumnIndexes();
        self.parsedData.length = 0;
        self.parseGroupData(self.groupedData);
    };

    if (grid.config.groups.length > 0 && grid.filteredData().length > 0) {
        self.getGrouping(grid.config.groups);
    }
};