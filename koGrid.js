/// <reference path="lib/knockout-latest.debug.js" />

(function () {

    var kg = {};

    //#region Utils
    var utils = (function () {
        var seedId = new Date().getTime();

        return {
            newId: function () {
                return seedId += 1;
            },

            extend: function (target, obj) {
                var len = arguments.length || 0;
                var targ, src, prop;

                len -= 1; // since the length of an array is always 1 more than the actual index of an object...

                //count backwards through the args array and extend each item until we end with the target
                while (len > 0) {
                    targ = arguments[len - 1];  //1
                    src = arguments[len];       //2

                    for (prop in src) {
                        if (src.hasOwnProperty(prop)) {
                            target[prop] = src[prop];
                        }
                    }
                    //decrement counter
                    len -= 1;
                }
                return targ;
            },
            //simply assigns the properties of the target with the properties of the src ONLY where they exist on both objects
            //this prevents users from accidentally passing in an options with the wrong name and us tacking it on to the object
            matchExtend: function (target, src) {
                var prop;

                for (prop in target) {
                    if (target.hasOwnProperty(prop) && src.hasOwnProperty(prop)) {
                        target[prop] = src[prop];
                    }
                }

                return target;
            },

            each: function (obsArray, callBack) {
                var index = 0,
                    items = ko.isObservable(obsArray) ? obsArray() : obsArray,
                    max = items.length || 0;
                for (; index < max; index++) {
                    callBack(index, items[index]);
                }
            },

            eachIn: function (obj, callback) {
                var prop, index = 0;

                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        callback(prop, index);
                        index += 1;
                    }
                }
            }

        };
    } ());
    //#endregion

    var baseObj = function () {

        this.init = function (options) {
            utils.matchExtend(this, options);
            if (this.settings) {
                utils.matchExtend(this.settings, options); // we will let the user pass in some options that we store in the settings object
            }
        };
    };

    kg.Column = function (options) {
        var _this = this;

        this.colIndex = ko.observable(0);
        this.propBindingKey = '';
        this.displayName = '';
        this.element = null;

        this.width = ko.observable(100);

        this.offsetLeft = ko.dependentObservable(function () {
            return _this.colIndex() * _this.width();
        });

        this.init(options);
    };
    kg.Column.prototype = new baseObj();

    kg.HeaderCell = function (options) {
        this.headerIndex = 0;
        this.displayName = '';
        this.column = null;

        this.init(options);
    };
    kg.HeaderCell.prototype = new baseObj();

    kg.Row = function () {
        var _this = this;

        this.cells = ko.observableArray([]);

        this.rowIndex = ko.observable(0);
        this.height = ko.observable(45);
        this.offsetTop = ko.dependentObservable(function () {
            var ht = _this.height();
            return (ht * _this.rowIndex());
        });

        this.element = null;
    };

    kg.Cell = function () {

        this.data = ko.observable('');
        this.entity = null;

        this.row = null;
        this.column = null;
        this.element = null;
    };

    kg.RowsBindingContext = function () {
        this.topIndex = 0;
        this.bottomIndex = 30;

    };

    kg.KnockoutGrid = function (options) {
        var _this = this,
            currentTopIndex = 0,
            currentBottomIndex = 30;

        this.settings = {
            autogenerateColumns: true
        };

        this.prevScrollTop = 0;
        this.lastScrollOn = new Date().getTime();

        this.scrollTop = ko.observable(0);//.extend({ throttle: 20 });
        this.scrollTop.subscribe(function (newValue) {
            _this.adjustRows(newValue);
        });

        this.rowHeight = ko.observable(35);

        this.startRow = ko.observable(0);//.extend({ throttle: 0 });
        this.endRow = ko.observable(30);//.extend({ throttle: 0 });
        this.itemSource = ko.observableArray([]);

        this.columns = ko.observableArray([]);
        this.headers = ko.observableArray([]);

        //#region Private Methods
        var registerDependantObservables = function () {

            _this.rows = ko.dependentObservable(function () {
                var rowArray = [],
                    startRow = _this.startRow(),
                    endRow = _this.endRow(),
                    row,
                    visibleItems = _this.itemSource.slice(_this.startRow(), _this.endRow());

                utils.each(visibleItems, function (i, item) {

                    row = _this.buildRowFromObj(item);
                    row.rowIndex(startRow + i);
                    rowArray.push(row);

                });
                return rowArray;
            });

            _this.itemCount = ko.dependentObservable(function () {
                return _this.itemSource().length || 0;
            });
        };

        this.rowsBindingContext = ko.observable({ topIndex: 0, bottomIndex: 30 });//.extend({ throttle: 20 });
        this.rowsBindingContext.subscribe(function (newValue) {
            //if (_this.viewableRowsHaveChanged(newValue)) {
                _this.prevTopIndex = currentTopIndex;
                _this.prevBottomIndex = currentBottomIndex;
                currentTopIndex = newValue.topIndex;
                currentBottomIndex = newValue.bottomIndex;
            //}
        });
        this.rowCache = {};
        this.renderedRowElementCache = {};
        this.prevTopIndex = 0;
        this.prevBottomIndex = 30;
        this.viewableRowCount = 30;

        //elements
        this.rowContainer = null;
        this.viewport = null;

        //#endregion
        this.init(options);
        registerDependantObservables();
        if (this.settings.autogenerateColumns) { this.buildColumns(); }
        this.buildHeaders();
    };
    kg.KnockoutGrid.prototype = new baseObj();

    kg.KnockoutGrid.prototype.buildColumns = function () {
        var _this = this,
            cols = [],
            col,
            item = this.itemSource()[0];

        utils.eachIn(item, function (prop, i) {

            col = new kg.Column({
                propBindingKey: prop,
                displayName: prop
            });

            col.colIndex(i);

            cols.push(col);
        });

        this.columns(cols);
    };

    kg.KnockoutGrid.prototype.buildHeaders = function () {
        var _this = this,
            hdr,
            hdrs = [];

        utils.each(_this.columns, function (i, item) {
            hdr = new kg.HeaderCell({
                headerIndex: i,
                displayName: item.displayName,
                column: item
            });

            hdrs.push(hdr);
        });

        this.headers(hdrs);
    };

    kg.KnockoutGrid.prototype.buildRowFromObj = function (item) {
        var _this = this,
            cell,
            cells = [],
            row = new kg.Row();

        utils.each(this.columns, function (i, col) {
            cell = new kg.Cell();
            cell.data(item[col.propBindingKey]);
            cell.entity = item;
            cell.column = col;
            cell.row = row;
            cells.push(cell);
        });

        row.height(this.rowHeight());
        row.cells(cells);
        return row;
    };

    kg.KnockoutGrid.prototype.buildRowFromItemIndex = function (index) {
        var item = this.itemSource()[index],
            row = this.buildRowFromObj(item);

        row.rowIndex(index);
        return row;
    };

    kg.KnockoutGrid.prototype.handleScrollEvent = function (evt) {
        this.scrollTop(evt.target.scrollTop);
    };

    kg.KnockoutGrid.prototype.adjustRows = function (scrollTop) {
        var currentIndex,
            totalHeight,
            totalItems = this.itemCount(),
            newStart,
            newEnd;

        totalHeight = (totalItems * this.rowHeight());

        currentIndex = scrollTop / this.rowHeight();

        currentIndex = Math.round(currentIndex);

        currentIndex = currentIndex > 0 ? currentIndex : 0;

        newStart = currentIndex > 10 ? currentIndex - 10 : 0;
        newEnd = (totalItems - currentIndex) > 30 ? (currentIndex + 30) : totalItems;

        this.rowsBindingContext({ topIndex: newStart, bottomIndex: newEnd - 1 });
    };

    kg.KnockoutGrid.prototype.removeRows = function (startIndex, stopIndex) {
        var i = startIndex,
            stop = stopIndex += 1,
            node;

        while (i < stop) {
            node = this.renderedRowElementCache["" + i + ""];
            if (node) {
                ko.removeNode(node);
                delete this.renderedRowElementCache["" + i + ""];
            }
            i += 1;
        }
    };

    kg.KnockoutGrid.prototype.addNewRows = function (startIndex, stopIndex) {
        var i = startIndex,
            stop = stopIndex += 1,
            container = this.rowContainer,
            newRows = [],
            row,
            node;

        while (i < stop) {
            node = this.renderedRowElementCache["" + i + ""]; //in DOM already
            if (!node) {
                row = this.rowCache["" + i + ""]; //not in DOM, but already built
                if (!row) {
                    row = this.buildRowFromItemIndex(i);
                    //cache it
                    this.rowCache["" + i + ""] = row;
                }
                node = document.createElement('DIV');
                node.setAttribute("data-bind", "koGridRow: $data.rowCache[" + i + "]");
                row.element = node;
                container.appendChild(node);
                this.renderedRowElementCache["" + i + ""] = node;
                newRows.push(row); //only the ones that are being rendered
            }
            i += 1;
        }

        return newRows;
    };

    kg.KnockoutGrid.prototype.viewableRowsHaveChanged = function () {

        var context = arguments[0] || this.rowsBindingContext();

        if (Math.abs(this.prevTopIndex - context.topIndex) > 5) {
            return true;
        }
        if (Math.abs(this.prevBottomIndex - context.bottomIndex) > 5) {
            return true;
        }
    };

    kg.renderingEngine = (function () {

        return {
            'renderRow': function (element, row, grid) {
                element.style.position = "absolute";
                element.style.top = row.offsetTop() + 'px';
                element.style.height = row.height() + 'px';

                utils.each(row.cells, function (i, item) {
                    var cellEl = document.createElement('DIV');
                    item.element = cellEl;
                    //cellEl.setAttribute("data-bind", "koGridCell: $data.rowCache");
                    element.appendChild(cellEl);
                });
                return row;
            },
            'renderCell': function (element, cell, grid) {
                element.style.position = "absolute";
                element.style.left = cell.column.offsetLeft() + 'px';
                element.style.width = cell.column.width() + 'px';
                element.style.height = cell.row.height() + 'px';
                element.className = "koGridCell";

                return cell;
            }
        };
    } ());


    ko.bindingHandlers['koGrid'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            return ko.bindingHandlers['with'].init(element, valueAccessor, allBindingsAccessor);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()),
                grid = new kg.KnockoutGrid(options),
                newBindingContext = bindingContext.createChildContext(grid),
                newValueAccessor = function () {
                    return grid;
                };

            return ko.bindingHandlers['with'].update(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };

    ko.bindingHandlers['koGridHeader'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return ko.bindingHandlers['foreach'].init(element, valueAccessor, allBindingsAccessor);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return ko.bindingHandlers['foreach'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };

    ko.bindingHandlers['koGridHeaderCellWrapper'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var hdrCell = ko.utils.unwrapObservable(valueAccessor());
            element.style.position = "absolute";
            element.style.left = hdrCell.column.offsetLeft() + 'px';
            element.style.width = hdrCell.column.width() + 'px';
            element.className = "koGridHeaderCell";
        }
    };

    ko.bindingHandlers['koGridViewPort'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            ko.utils.registerEventHandler(element, "scroll", function (evt) {

                grid.handleScrollEvent(evt);

            });

            grid.viewport = element;
        }
    };

    ko.bindingHandlers['koGridRows'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            return ko.bindingHandlers['foreach'].init(element, valueAccessor, allBindingsAccessor);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var rows = ko.utils.unwrapObservable(valueAccessor()),
                grid = bindingContext.$data,
                count = grid.itemCount();

            element.style.height = (count * grid.rowHeight()) + 'px';

            return ko.bindingHandlers['foreach'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };

    ko.bindingHandlers['koGridRows2'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data,
                newRows,
                count = grid.itemCount();

            element.style.height = (count * grid.rowHeight()) + 'px';
            grid.rowContainer = element;

            //add the new rows
            newRows = grid.addNewRows(grid.prevTopIndex, grid.prevBottomIndex);

            utils.each(newRows, function (i, row) {
                ko.bindingHandlers.koGridRow.init(row.element, function () { return row; }, allBindingsAccessor, viewModel, bindingContext);
            });

            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var rowsBindingContext = ko.utils.unwrapObservable(valueAccessor()),
                grid = bindingContext.$data,
                removeIndexStart,
                removeIndexStop,
                isScrollDown,
                newRows = [];

            //if change is more than 5
            //if (grid.viewableRowsHaveChanged()) {

                isScrollDown = (grid.prevTopIndex < rowsBindingContext.topIndex);

                if (isScrollDown) {

                    removeIndexStart = grid.prevTopIndex;
                    removeIndexStop = rowsBindingContext.topIndex - 1;

                } else {

                    removeIndexStart = grid.prevBottomIndex;
                    removeIndexStop = rowsBindingContext.bottomIndex + 1;

                }

                //add new rows
                newRows = grid.addNewRows(rowsBindingContext.topIndex, rowsBindingContext.bottomIndex);

                utils.each(newRows, function (i, row) {
                    ko.bindingHandlers.koGridRow.init(row.element, function () { return row; }, allBindingsAccessor, viewModel, bindingContext);
                });

                //remove old rows
                grid.removeRows(removeIndexStart, removeIndexStop);
            //}
        }
    };

    ko.bindingHandlers['koGridRow'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = ko.utils.unwrapObservable(valueAccessor()),
                rowEl = kg.renderingEngine.renderRow(element, row, bindingContext.$data);

            utils.each(row.cells, function (i, cell) {

                ko.bindingHandlers.koGridCell.update(cell.element, function () { return cell }, allBindingsAccessor, viewModel, bindingContext.createChildContext(cell));
            });
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        }
    };

    ko.bindingHandlers['koGridCell'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var cell = ko.utils.unwrapObservable(valueAccessor()),
                newValueAccessor = function () {
                    return cell.data() || '';
                };

            kg.renderingEngine.renderCell(element, cell, bindingContext.$data);

            return ko.bindingHandlers['text'].update(element, newValueAccessor);
        }
    };

    kg.utils = utils;
    window['kg'] = kg;

} (window.ko));
