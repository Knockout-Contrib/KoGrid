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
﻿ 
 
 
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
* FILE: ..\Src\Templates\GridTemplate.js 
***********************************************/ 
﻿kg.defaultGridInnerTemplate = function () {
    return '<div class="kgHeaderContainer" style="position: relative; overflow-x: hidden">' +
                '<div class="kgHeaderScroller" data-bind="kgHeaderRow: $data">' +
                '</div>' +
            '</div>' +
            '<div class="kgViewport" style="overflow: auto;">' +
                '<div class="kgCanvas" data-bind="kgRows: $data.rows" style="position: relative">' +
                '</div>' +
            '</div>' +
            '<div class="kgFooterContainer" style="position: relative">' +
                '<div class="kgFooters">' +
                '</div>' +
            '</div>';
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\HeaderTemplate.js 
***********************************************/ 
﻿kg.defaultHeaderTemplate = function () {
    return '<div data-bind="kgHeader: { value: \'Sku\' } "></div>' +
           '<div data-bind="kgHeader: { value: \'Vendor\' } "></div>' +
           '<div data-bind="kgHeader: { value: \'SeasonCode\' } "></div>' +
           '<div data-bind="kgHeader: { value: \'Mfg_Id\' } "></div>' +
           '<div data-bind="kgHeader: { value: \'UPC\' } "></div>';
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\RowTemplate.js 
***********************************************/ 
﻿kg.defaultRowTemplate = function () {
    return '<div data-bind="kgRow: $data">' +
                '<div data-bind="kgCell: { value: \'Sku\' } "></div>' +
                '<div data-bind="kgCell: { value: \'Vendor\' } "></div>' +
                '<div data-bind="kgCell: { value: \'SeasonCode\' } "></div>' +
                '<div data-bind="kgCell: { value: \'Mfg_Id\' } "></div>' +
                '<div data-bind="kgCell: { value: \'UPC\' } "></div>' +
            '</div>';
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Cell.js 
***********************************************/ 
﻿kg.Cell = function (col) {
    this.data = ko.observable();
    this.width = ko.computed(function () {
        return col.width();
    });
    this.offsetLeft = ko.computed(function () {
        return col.offsetLeft();
    });
    this.offsetRight = ko.computed(function(){
        return col.offsetRight();
    });
    this.column = col;
    this.row = null;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Column.js 
***********************************************/ 
﻿kg.Column = function (colDef) {
    this.width = ko.observable(0);
    this.offsetLeft = ko.observable(0);
    this.offsetRight = null; //replaced w/ ko.computed
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
    this.width = ko.observable(0);
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

            cell = new kg.Cell(col);
            cell.row = row;
            cell.data(row.entity()[col.field]);

            cells.push(cell);
            row.cellMap[col.field] = cell;
        }
        row.cells(cells);

        return row;
    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\HeaderCell.js 
***********************************************/ 
﻿kg.HeaderCell = function (col) {
    this.colIndex = 0;
    this.displayName = '';
    this.field = '';
    this.column = col;

    this.width = ko.computed(function () {
        return col.width();
    });

    this.offsetLeft = ko.computed(function () {
        return col.offsetLeft();
    });

    this.offsetRight = ko.computed(function () {
        return col.offsetRight();
    });
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\HeaderRow.js 
***********************************************/ 
﻿kg.HeaderRow = function () {
    this.headerCells = [];
    this.height;
    this.headerCellMap = {};
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\RowManager.js 
***********************************************/ 
﻿kg.RowManager = function (grid) {
    var self = this,
        rowCache = {},
        prevRenderedRange = new kg.Range(0, 1),
        maxRows = grid.filteredData().length;

    this.rowTemplateId = grid.config.rowTemplate;
    this.dataSource = grid.filteredData; //observable
    this.minViewportRows = ko.computed(function () { return grid.config.minRowsToRender(); });
    this.excessRows = 5;
    this.rowHeight = grid.config.rowHeight;
    this.cellFactory = new kg.CellFactory(grid.columns());
    this.viewableRange = ko.observable(new kg.Range(0, 1));

    this.renderedRange = ko.computed(function () {
        var rg = self.viewableRange(),
            isDif = false;

        if (rg) {

            isDif = (rg.bottomRow !== prevRenderedRange.bottomRow || rg.topRow !== prevRenderedRange.topRow)

            if (isDif) {
                rg.topRow = rg.bottomRow + self.minViewportRows(); //make sure we have the correct number of rows rendered

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

            row = new kg.Row();
            row.rowIndex = rowIndex;
            row.height = ko.computed(function () {
                return grid.config.rowHeight;
            });
            row.offsetTop = self.rowHeight * rowIndex;

            row.width = ko.computed(function () {
                return grid.config.maxRowWidth();
            });
            row.entity(entity);

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
 
 
/*********************************************** 
* FILE: ..\Src\KoGrid.js 
***********************************************/ 
﻿/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 25,
        columnWidth: 100,
        headerRowHeight: 30,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        footerTemplate: null,
        gridCssClass: 'koGrid',
        autogenerateColumns: true,
        autoFitColumns: true,
        data: null, //ko.observableArray
        columnDefs: [],
        minRowsToRender: ko.observable(1),
        maxRowWidth: ko.observable(120)
    },

    self = this,

    $root, //this is the root element that is passed in with the binding handler
    $headerContainer,
    $headerScroller,
    $headers,
    $viewport,
    $canvas,
    $footerContainer,
    $footers,

    viewportH, viewportW,
    scrollW, scrollH,

    //scrolling
    prevScrollTop, prevScrollLeft;

    this.config = $.extend(defaults, options)
    this.gridId = "kg" + kg.utils.newId();

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;
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

    this.headerRow;


    this.update = function (rootDomNode) {
        //build back the DOM variables
        updateDomStructure(rootDomNode);

        measureDomConstraints();

        calculateConstraints();

        kg.cssBuilder.buildStyles(self);

        self.rowManager.viewableRange(new kg.Range(0, self.config.minRowsToRender()));
    };

    var updateDomStructure = function (rootDomNode) {

        $root = $(rootDomNode);

        // the 'with' binding blows away everything except the inner html, so rebuild it

        //Headers
        $headerContainer = $(".kgHeaderContainer", $root[0]);
        $headerScroller = $(".kgHeaderScroller", $headerContainer[0]);
        $headers = $headerContainer.children();

        //Viewport
        $viewport = $(".kgViewport", $root[0]);

        //Canvas
        $canvas = $(".kgCanvas", $viewport[0]);

        //Footers
        $footerContainer = $(".kgFooterContainer", $root[0]);
        $footers = $footerContainer.children();
    };

    var measureDomConstraints = function () {
        //pop the canvas, so we can measure the attributes
        $viewport.height(200).width(200);

        $canvas.height(100000); //pretty large, so the scroll bars, etc.. should open up
        $canvas.width(100000);

        $headerContainer.height(self.config.headerRowHeight);

        scrollH = ($viewport.height() - $viewport[0].clientHeight) + 1; //this needs to roundup
        scrollW = ($viewport.width() - $viewport[0].clientWidth) + 1; //roundup

        viewportH = $root.height() - $headerContainer.height();
        viewportW = Math.min($root.width(), self.config.maxRowWidth() + scrollW);

        $viewport.height(viewportH);
        $viewport.width(viewportW);

        $canvas.width("auto");

        $headerContainer.width(viewportW - scrollW);
        $headerScroller.width(self.config.maxRowWidth());
    };

    var calculateConstraints = function () {

        //figure out how many rows to render in the viewport based upon the viewable height
        self.config.minRowsToRender(Math.floor(viewportH / self.config.rowHeight));

    };

    var buildColumnDefsFromData = function () {
        var item = self.data()[0];

        utils.forIn(item, function (prop, propName) {

            self.config.columnDefs.push({
                field: propName
            });
        });

    };

    var buildColumns = function () {
        var columnDefs = self.config.columnDefs,
            column,
            rowWidth = 0;

        if (self.config.autogenerateColumns) { buildColumnDefsFromData(); }

        var createOffsetRightClosure = function (col, rowMaxWidthObs) {
            return function () {
                return ko.computed(function () {
                    var maxWidth = rowMaxWidthObs(),
                        width = col.width(),
                        offsetRight;

                    offsetRight = (maxWidth - col.offsetLeft());
                    offsetRight = offsetRight - width;
                    return offsetRight;
                });
            };
        };

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.offsetLeft(i * self.config.columnWidth);
                column.width(colDef.width || self.config.columnWidth);

                rowWidth += column.width(); //sum this up

                //setup the max col width observable
                column.offsetRight = createOffsetRightClosure(column, self.config.maxRowWidth)();

                self.columns.push(column);
            });

            self.config.maxRowWidth(rowWidth);
        }
    };

    this.init = function () {
        ensureTemplates();

        buildColumns();

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable
    };

    this.registerEvents = function () {
        $viewport.scroll(handleScroll);
    };

    var handleScroll = function (e) {
        var scrollTop = e.target.scrollTop,
            scrollLeft = e.target.scrollLeft,
            rowIndex;

        $headerContainer.scrollLeft(scrollLeft);

        if (prevScrollTop === scrollTop) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.config.minRowsToRender()));

    };

    var ensureTemplates = function () {
        var appendToFooter = function (el) {
            document.body.appendChild(el);
        };

        if (!document.getElementById(self.config.rowTemplate)) {
            var tmpl = document.createElement("SCRIPT");
            tmpl.type = "text/html";
            tmpl.id = self.config.rowTemplate;
            tmpl.innerText = kg.defaultRowTemplate();
            appendToFooter(tmpl);
        }

        if (!document.getElementById(self.config.headerTemplate)) {
            var tmpl = document.createElement("SCRIPT");
            tmpl.type = "text/html";
            tmpl.id = self.config.headerTemplate;
            tmpl.innerText = kg.defaultHeaderTemplate();
            appendToFooter(tmpl);
        }
    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\DomFormatters\kgDomFormatter.js 
***********************************************/ 
﻿kg.domFormatter = {
    formatGrid: function (element, grid) {

        $(element).addClass("kgGrid").addClass(grid.gridId.toString());

        element.style.position = "relative";
    },

    formatHeaderRow: function (element, headerRow) {
        element.style.height = headerRow.height + 'px';
    },

    formatRow: function (element, row) {
        var classes = 'kgRow';
        classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

        element['_kg_rowIndex_'] = row.rowIndex;
        element.style.top = row.offsetTop + 'px';
        element.className = classes;
    },

    formatCell: function (element, cell) {

        element.className = "kgCell " + "col" + cell.column.index;

    }
};
 
 
 
/*********************************************** 
* FILE: ..\Src\DomFormatters\CssBuilder.js 
***********************************************/ 
﻿kg.cssBuilder = {

    buildStyles: function (grid) {
        var $style = $("<style type='text/css' rel='stylesheet' />");
        var rowHeight = (grid.config.rowHeight),
            gridId = grid.gridId,
            rules,
            i = 0,
            len = grid.columns().length,
            col;

        rules = [
            "." + gridId + " .kgHeaderRow { height:" + grid.config.headerRowHeight + "px; }",
            "." + gridId + " .kgCell { position: absolute; height:" + rowHeight + "px; overflow: hidden;}",
            "." + gridId + " .kgRow { position: absolute; width:" + grid.config.maxRowWidth() + "px; height:" + rowHeight + "px; }"
        ];

        for (; i < len; i++) {
            col = grid.columns()[i];
            rules.push("." + gridId + " .col" + i + " { left: " + col.offsetLeft() + "px; right: " + col.offsetRight() + "px; width: " + col.width() + "px; }");
        }

        if ($style[0].styleSheet) { // IE
            $style[0].styleSheet.cssText = rules.join(" ");
        }
        else {
            $style[0].appendChild(document.createTextNode(rules.join(" ")));
        }

        $('head')[0].appendChild($style[0]);
    }
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

    var setupGridLayout = function (element) {
        $(element).empty().html(kg.defaultGridInnerTemplate());
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = new kg.KoGrid(valueAccessor()),
                returnVal;

            element['__koGrid__'] = grid.gridId;

            setupGridLayout(element);

            grid.init();

            kg.domFormatter.formatGrid(element, grid);

            returnVal = ko.bindingHandlers['with'].init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

            gridCache[grid.gridId] = grid;

            return returnVal;
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid, returnVal, gridId;

            gridId = element['__koGrid__'];

            if (gridId) {

                grid = gridCache[gridId];

                returnVal = ko.bindingHandlers['with'].update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid));

                grid.update(element);

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

ko.bindingHandlers['kgRows'] = (function () {

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
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor());

            var newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            return ko.bindingHandlers.template.init(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor());

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

ko.bindingHandlers['kgRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor(),
                rowManager = bindingContext.$parent.rowManager;

            kg.domFormatter.formatRow(element, row);
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGridCellBindingHandler.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgCell'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = valueAccessor(),
                cell,
                row = bindingContext.$data;

            //get the cell from the options
            cell = row.cellMap[options.value];

            kg.domFormatter.formatCell(element, cell);
            ko.bindingHandlers.text.update(element, function () { return cell.data() });
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\koGridHeaderRowBindingHandler.js 
***********************************************/ 
﻿ko.bindingHandlers['kgHeaderRow'] = (function () {

    var buildHeaders = function (grid) {
        var cols = grid.columns(),
            cell,
            headerRow = new kg.HeaderRow();

        utils.forEach(cols, function (col, i) {
            cell = new kg.HeaderCell(col);
            cell.colIndex = i;
            cell.displayName = col.field;

            headerRow.headerCells.push(cell);
            headerRow.headerCellMap[col.field] = cell;
        });

        grid.headerRow = headerRow;
        grid.headerRow.height = grid.config.headerRowHeight;
    };

    var makeNewValueAccessor = function (grid) {
        return function () {
            return { name: grid.config.headerTemplate, data: grid.headerRow };
        }
    };

    var makeNewBindingContext = function (bindingContext, headerRow) {
        return bindingContext.createChildContext(headerRow);
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            buildHeaders(grid);

            kg.domFormatter.formatHeaderRow(element, grid.headerRow);

            return ko.bindingHandlers.template.init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid.headerRow));
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            return ko.bindingHandlers.template.update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid.headerRow));
        }
    }
} ()); 
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\koGridHeaderCellBindingHandler.js 
***********************************************/ 
﻿ko.bindingHandlers['kgHeader'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                property = valueAccessor().value; //string of the property name

            var cell = headerRow.headerCellMap[property];

            element.style.position = "absolute";
            element.style.width = cell.width();
            element.style.left = cell.offsetLeft() + 'px';
            element.style.right = cell.offsetRight() + 'px';

            ko.bindingHandlers['text'].update(element, function () { return cell.displayName; });

        }
    }
} ()); 
}(window)); 
