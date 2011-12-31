(function(window, undefined){ 
 
 
/*********************************************** 
* FILE: ..\Src\namespace.js 
***********************************************/ 
﻿
var kg = window['kg'] = {}; 
 
 
/*********************************************** 
* FILE: ..\Src\constants.js 
***********************************************/ 
﻿/* File Created: December 29, 2011 */ 
 
 
/*********************************************** 
* FILE: ..\Src\core.js 
***********************************************/ 
﻿/* File Created: December 29, 2011 */ 
 
 
/*********************************************** 
* FILE: ..\Src\utils.js 
***********************************************/ 
﻿var utils = {

    forEach: function (arr, action) {
        var len = arr.length,
            i = 0;
        for (; i < len; i++) {
            if (arr[i] !== undefined) {
                action(arr[i], i);
            }
        }
    },

    forIn: function (obj, action) {
        var prop;

        for (prop in obj) {
            if(obj.hasOwnProperty(prop)){
                action(obj[prop], prop);
            }
        }
    }
};

utils.newId = (function () {
    var seedId = new Date().getTime();

    return function () {
        return seedId += 1;
    };
} ());

kg.utils = utils; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Cell.js 
***********************************************/ 
﻿kg.Cell = function () {
    this.data = ko.observable();
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.column = null;
    this.row = null;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Column.js 
***********************************************/ 
﻿kg.Column = function (colDef) {
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.field = colDef.field;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\ColumnCollection.js 
***********************************************/ 
﻿kg.ColumnCollection = function () {

    var obs = ko.observableArray([]);
    ko.utils.extend(obs, kg.ColumnCollection.fn);

    return obs;
};

kg.ColumnCollection.fn = {

}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Row.js 
***********************************************/ 
﻿kg.Row = function () {
    this.entity = ko.observable();
    this.cells = ko.observableArray([]);
    this.cellMap = {};
    this.rowIndex = 0;
    this.offsetTop = 0;
    this.height = ko.observable(0);
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Range.js 
***********************************************/ 
﻿kg.Range = function (bottom, top) {
    this.topRow = top;
    this.bottomRow = bottom;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\CellFactory.js 
***********************************************/ 
﻿kg.CellFactory = function (cols) {
    var colCache = cols,
        len = colCache.length;

    this.buildRowCells = function (row) {
        var cell,
            cells = [],
            col,
            i = 0;

        for (; i < len; i++) {
            col = colCache[i];

            cell = new kg.Cell();
            cell.column = col;
            cell.row = row;
            cell.data(row.entity()[col.field]);
            cell.width(col.width());
            cell.offsetLeft(col.offsetLeft);

            cells.push(cell);
            row.cellMap[col.field] = cell;

        }
        row.cells(cells);
        return row;
    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\RowManager.js 
***********************************************/ 
﻿kg.RowManager = function (cols, dataSource, canvas, config) {
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
 
 
/*********************************************** 
* FILE: ..\Src\KoGrid.js 
***********************************************/ 
﻿/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 25,
        columnWidth: 80,
        headerRowHeight: 35,
        rowTemplate: 'koGridRowTemplate',
        headerTemplate: null,
        footerTemplate: null,
        gridCssClass: 'koGrid',
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: []
    },

    config = $.extend(defaults, options),
    self = this,

    $root, //this is the root element that is passed in with the binding handler
    $headerContainer,
    $headers,
    $viewport,
    $canvas,
    $footerContainer,
    $footers,

    viewportH, viewportW;

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = config.data;
    this.filteredData = ko.computed(function () {

        //TODO: build out filtering
        return self.data();
    });
    this.maxRows = ko.computed(function () {
        rows = self.filteredData();
        return rows.length || 0;
    });

    this.columns = new kg.ColumnCollection();

    //initialized in the init method
    this.rowManager;
    this.rows;

    var buildDomStructure = function (rootDomNode) {
        $root = $(rootDomNode);
        $root.empty();

        $root.css("position", "relative");

        //Headers
        $headerContainer = $('<div class="kgHeaderContainer" style="position: relative;"></div>').appendTo($root);

        //Viewport
        $viewport = $('<div class="kgViewport" style="overflow: auto;"></div>').appendTo($root);

        //Canvas
        $canvas = $('<div class="kgCanvas" style="position: relative;" data-bind="koGridRows: nonRenderedRows"></div>').appendTo($viewport);

        //Footers
        $footerContainer = $('<div class="kgFooterContainer"></div>').appendTo($root);
    };

    var measureDomConstraints = function () {

        viewportH = $root.height() - 35;
        viewportW = $root.width();
        $viewport.height(viewportH);
    };

    var calculateConstraints = function () {

        //figure out how many rows to render in the viewport based upon the viewable height
        minRowsToRender = Math.floor(viewportH / config.rowHeight);

    };

    var buildColumnDefsFromData = function () {
        var item = self.data()[0];

        utils.forIn(item, function (prop, propName) {

            config.columnDefs.push({
                field: propName
            });
        });

    };

    var buildColumns = function () {
        var columnDefs = config.columnDefs,
            column;

        if (config.autogenerateColumns) { buildColumnDefsFromData(); }

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.offsetLeft = i * config.columnWidth;
                column.width(config.columnWidth);

                self.columns.push(column);
            });
        }
    };

    var buildHeaders = function () {

        $headers = $('<div class="kgHeaderRow"></div>').appendTo($headerContainer);
        $headers.height(config.headerRowHeight);
        utils.forEach(self.columns(), function (col, i) {

            $('<div></div>').text(col.field)
                            .css("position", "absolute")
                            .css("left", col.offsetLeft)
                            .css("top", 0)
                            .width(col.width())
                            .appendTo($headers);
        });
    };

    this.init = function (rootDomNode) {

        buildDomStructure(rootDomNode);
        measureDomConstraints();
        calculateConstraints();
        buildColumns();
        buildHeaders();

        self.rowManager = new kg.RowManager(self.columns(), self.filteredData, $canvas, config);
        self.rowManager.minViewportRows = minRowsToRender;

        self.rows = self.rowManager.rows; // dependent observable
        self.nonRenderedRows = self.rowManager.nonRenderedRows;

        self.rowManager.viewableRange(new kg.Range(0, minRowsToRender));
    };

    this.registerEvents = function () {
        $viewport.scroll(handleScroll);
    };

    var handleScroll = function (e) {

        var test = e;

    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGridBindingHandler.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGrid'] = (function () {
    var gridCache = {};

    var makeNewValueAccessor = function (grid) {
        return function () {
            return grid;
        };
    };

    var makeNewBindingContext = function (bindingContext, grid) {
        return bindingContext.createChildContext(grid);
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = new kg.KoGrid(valueAccessor()),
                returnVal,
                gridId;

            gridId = kg.utils.newId();
            element['__koGrid__'] = gridId;

            grid.init(element);

            gridCache[gridId] = grid;

            returnVal = ko.bindingHandlers['with'].init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

            return returnVal;
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                returnVal,
                gridId;

            gridId = element['__koGrid__'];

            if (gridId) {

                grid = gridCache[gridId];

                returnVal = ko.bindingHandlers['with'].update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

                grid.registerEvents();
            }
            return returnVal;
        }
    };

} ());
 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGridRowsBindingHandler.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridRows'] = (function () {

    var cleanupCanvas = function (rowManager) {
        var rg = rowManager.renderedRange(),
            rowEl,
            len = rowManager.rowElCache.length,
            i = 0;

        while (i < rg.bottomRow) {

            rowEl = rowManager.rowElCache[i];
            if (rowEl) {
                ko.utils.domNodeDisposal.removeNode(rowEl);
                delete rowManager.rowElCache[i];
            }
            i++;
        }

        i = rg.topRow;
        i += 1;

        while (i < len) {

            rowEl = rowManager.rowElCache[i];
            if (rowEl) {
                ko.utils.domNodeDisposal.removeNode(rowEl);
                delete rowManager.rowElCache[i];
            }
            i++;
        }
    };

    var makeNewValueAccessor = function (rows, rowTemplateName) {
        return function () {
            return {
                name: rowTemplateName,
                foreach: rows
            };
        };
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor());

            cleanupCanvas(rowManager);

            element.style.height = (bindingContext.$data.maxRows() * rowManager.rowHeight) + 'px';

            var newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            return ko.bindingHandlers.template.update(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGridRowBindingHandler.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor(),
                rowManager = bindingContext.$parent.rowManager;

            //style the element correctly:
            element.style.position = "absolute";
            element.style.height = row.height();
            element.style.top = row.offsetTop + 'px';

            rowManager.rowElCache[row.rowIndex] = element;
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGridCellBindingHandler.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGridCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = valueAccessor(),
                cell,
                row = bindingContext.$data;

            //get the cell from the options
            cell = row.cellMap[options.value];

            //style the element correctly:
            element.style.position = "absolute";
            element.style.left = cell.offsetLeft() + 'px';
            element.style.width = cell.width() + 'px';
            element.className = "kgCell"
            element.innerHTML = ko.utils.unwrapObservable(cell.data());
        }
    };

} ()); 
}(window)); 
