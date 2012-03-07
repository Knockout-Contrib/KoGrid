/*********************************************** 
* KoGrid JavaScript Library 
* (c) Eric M. Barnard 
* License: MIT (http://www.opensource.org/licenses/mit-license.php) 
* Compiled At: 12:37:54.80 Wed 03/07/2012 
***********************************************/ 
(function(window, undefined){ 
 
 
/*********************************************** 
* FILE: ..\Src\Namespace.js 
***********************************************/ 
﻿
var kg = window['kg'] = {};
kg.templates = {}; 
 
 
/*********************************************** 
* FILE: ..\Src\Constants.js 
***********************************************/ 
﻿
var SELECTED_PROP = '__kg_selected__';
var GRID_TEMPLATE = 'koGridTmpl'; 
 
 
/*********************************************** 
* FILE: ..\Src\Labels.js 
***********************************************/ 
﻿kg.labels = {

}; 
 
 
/*********************************************** 
* FILE: ..\Src\Utils.js 
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

utils.StringBuilder = function () {
    var strArr = [];

    this.append = function (str, data) {
        var len = arguments.length,
            intMatch = 0,
            strMatch = '{0}',
            i = 1;

        if (len > 1) { // they provided data
            while (i < len) {

                //apparently string.replace only works on one match at a time
                //so, loop through the string and hit all matches
                while (str.indexOf(strMatch) !== -1) {
                    str = str.replace(strMatch, arguments[i]);
                }
                i++;
                intMatch = i - 1;
                strMatch = "{" + intMatch.toString() + "}";
            }
        }
        strArr.push(str);
    };

    this.toString = function () {
        var separator = arguments[0];
        if (separator !== null && separator !== undefined) {
            return strArr.join(separator);
        } else {
            return strArr.join("");
        }
    };
};

kg.utils = utils; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\GridTemplate.js 
***********************************************/ 
﻿kg.templates.defaultGridInnerTemplate = function () {
    return  '<div class="kgTopPanel" data-bind="kgSize: $data.headerDim">' +
                '<div class="kgHeaderContainer" style="position: relative; overflow-x: hidden" data-bind="kgSize: $data.headerDim">' +
                    '<div class="kgHeaderScroller" data-bind="kgHeaderRow: $data, kgSize: $data.headerScrollerDim">' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="kgViewport" style="overflow: auto;" data-bind="kgSize: $data.viewportDim">' +
                '<div class="kgCanvas" data-bind="kgRows: $data.rows, style: { height: $data.canvasHeight }" style="position: relative">' +
                '</div>' +
            '</div>' +
            '<div class="kgFooterPanel" data-bind="kgFooter: $data, kgSize: $data.footerDim" style="position: relative;">' +
                
            '</div>';
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\HeaderTemplate.js 
***********************************************/ 
﻿kg.templates.generateHeaderTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns,
        showFilter = options.showFilter;

    utils.forEach(cols, function (col, i) {
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('  <input type="checkbox" data-bind="checked: $parent.toggleSelectAll, visible: $parent.config.isMultiSelect"/>');
            b.append('</div>');
        } else if (col.field === 'rowIndex' && showFilter) {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('      <div title="Filter Results" class="kgFilterBtn openBtn" data-bind="visible: !$data.filterVisible(), click: $parent.showFilter_Click"></div>');
            b.append('      <div title="Close" class="kgFilterBtn closeBtn" data-bind="visible: $data.filterVisible, click: $parent.showFilter_Click"></div>');
            b.append('      <div title="Clear Filters" class="kgFilterBtn clearBtn" data-bind="visible: $data.filterVisible, click: $parent.clearFilter_Click"></div>');
            b.append('</div>');
        } else {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('</div>');
        }
    });

    return b.toString();
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\HeaderCellTemplate.js 
***********************************************/ 
﻿kg.templates.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort, css: { kgSorted: !$data.noSortVisible() }">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.noSortVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAEFJREFUKFNjYICC+vp6YyDeDcSCMDEwDRRQAuK7QPwfpAAuiSYBkkQoAHLOQAVgEjB6FYrxGBy8OvHaide1+PwJAMBIWUlZ9vlNAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortAscVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAAPElEQVQoU2NggIL6+npjIN4NxIIwMTANFFAC4rtA/B+kAC6JJgGSRCgAcs5ABWASMHoVw////3HigZAEACKmlTwMfriZAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortDescVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAAPUlEQVQoU2P4//8/Ay6MUwKkgQJJBnygvr7+DBD/x4JXMQAFlYD4LprkbriBaAoQEjAVQAXGQLwbiAVhYgD6kIBR+tr9IgAAAABJRU5ErkJggg=="/>');
    b.append('</div>');
    b.append('<div data-bind="visible: $parent.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter, valueUpdate: \'afterkeydown\'" style="width: 80%" tabindex="1" />');
    b.append('</div>');

    return b.toString();
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\RowTemplate.js 
***********************************************/ 
﻿kg.templates.generateRowTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns;

    b.append('<div data-bind="kgRow: $data, click: $data.toggleSelected, css: { kgSelected: $data.selected }">');

    utils.forEach(cols, function (col, i) {

        // check for the Selection Column 
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgCell: { value: \'{0}\' } ">', col.field);
            b.append('  <input type="checkbox" data-bind="checked: $data.selected" />');
            b.append('</div>');
        }
        // check for RowIndex Column
        else if (col.field === 'rowIndex') {
            b.append('<div class="kgRowIndexCell" data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        }
        // check for a Column with a Cell Template
        else if (col.hasCellTemplate) {
            // first pull the template
            var tmpl = kg.templateManager.getTemplateText(col.cellTemplate);
            
            // build the replacement text
            var replacer = "{ value: '" + col.field + "' }";

            // run any changes on the template for re-usable templates
            tmpl = tmpl.replace(/\$cellClass/g, col.cellClass || '');
            tmpl = tmpl.replace(/\$cellValue/g, "$data." + col.field);
            tmpl = tmpl.replace(/\$cell/g, replacer);

            b.append(tmpl);
        }
        // finally just use a basic template for the cell
        else {
            b.append('  <div class="{0}"  data-bind="kgCell: { value: \'{1}\' } "></div>', col.cellClass || '',  col.field);
        }
    });

    b.append('</div>');

    return b.toString();
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\FooterTemplate.js 
***********************************************/ 
﻿kg.templates.defaultFooterTemplate = function () {
    return '<div class="kgTotalSelectContainer" data-bind="visible: footerVisible">' +
                '<div class="kgFooterTotalItems">' +
                    '<span class="kgLabel">Total Items:</span> <span data-bind="text: maxRows"></span>' +
                '</div>' +
                '<div class="kgFooterSelectedItems">' +
                    '<span class="kgLabel">Selected Items:</span> <span data-bind="text: selectedItemCount"></span>' +
                '</div>' +
            '</div>' +
            '<div class="kgPagerContainer" data-bind="visible: pagerVisible() && footerVisible()">' +
                '<div style="float: right;">' +
                    '<div class="kgRowCountPicker"">' +
                        '<span class="kgLabel">Rows:</span>' +
                        '<select data-bind="options: pageSizes, value: selectedPageSize">' +
                        '</select>' +
                    '</div>' +
                    '<div class="kgPagerControl" style="float: left; min-width: 135px;">' +
                        '<input class="kgPagerFirst" type="button" data-bind="click: pageToFirst, enable: canPageBackward" title="First Page"/>' +
                        '<input class="kgPagerPrev" type="button"  data-bind="click: pageBackward, enable: canPageBackward" title="Previous Page"/>' +
                        '<input class="kgPagerCurrent" type="text" data-bind="value: protectedCurrentPage, enable: maxPages() > 1" />' +
                        '<input class="kgPagerNext" type="button"  data-bind="click: pageForward, enable: canPageForward" title="Next Page"/>' +
                        '<input class="kgPagerLast" type="button"  data-bind="click: pageToLast, enable: canPageForward" title="Last Page"/>' +
                    '</div>' +
                '</div>' +
            '</div>';
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\TemplateManager.js 
***********************************************/ 
﻿kg.templateManager = (new function () {
    var self = this;

    var templateExists = function (tmplId) {
        var el = document.getElementById(tmplId);
        return (el !== undefined && el !== null);
    };

    var addTemplate = function (templateText, tmplId) {
        var tmpl = document.createElement("SCRIPT");
        tmpl.type = "text/html";
        tmpl.id = tmplId;

        //        'innerText' in tmpl ? tmpl.innerText = templateText
        //                            : tmpl.textContent = templateText;

        tmpl.text = templateText;

        document.body.appendChild(tmpl);
    };

    this.addTemplateSafe = function (tmplId, templateTextAccessor) {
        if (!templateExists(tmplId)) {
            addTemplate(templateTextAccessor(), tmplId);
        }
    };

    this.ensureGridTemplates = function (options) {
        var defaults = {
            rowTemplate: '',
            headerTemplate: '',
            headerCellTemplate: '',
            footerTemplate: '',
            columns: null,
            showFilter: true
        },
        config = $.extend(defaults, options);

        //first ensure the koGrid template!
        self.addTemplateSafe(GRID_TEMPLATE, kg.templates.defaultGridInnerTemplate);

        //header row template
        if (config.headerTemplate) {
            self.addTemplateSafe(config.headerTemplate, function () {
                return kg.templates.generateHeaderTemplate(config);
            });
        }

        //header cell template
        if (config.headerCellTemplate) {
            self.addTemplateSafe(config.headerCellTemplate, kg.templates.defaultHeaderCellTemplate);
        }

        //row template
        if (config.rowTemplate) {
            self.addTemplateSafe(config.rowTemplate, function () {
                return kg.templates.generateRowTemplate(config);
            });
        }

        //footer template
        if (config.footerTemplate) {
            self.addTemplateSafe(config.footerTemplate, kg.templates.defaultFooterTemplate);
        }
    };

    this.getTemplateText = function (tmplId) {
        if (!templateExists(tmplId)) {
            return "";
        } else {
            var el = document.getElementById(tmplId);
            return el.text;
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Dimension.js 
***********************************************/ 
﻿kg.Dimension = function (options) {
    this.innerHeight = null;
    this.innerWidth = null;
    this.outerHeight = null;
    this.outerWidth = null;
    this.widthDiff = null;
    this.heightDiff = null;

    this.autoFitHeight = false; //tells it to just fit to the wrapping container
    this.autoFitWidth = false;

    $.extend(this, options);
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Cell.js 
***********************************************/ 
﻿kg.Cell = function (col) {
    this.data = '';
    this.column = col;
    this.row = null;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Column.js 
***********************************************/ 
﻿kg.Column = function (colDef) {
    this.width = ko.observable(0);

    this.field = colDef.field;
    this.displayName = colDef.displayName || colDef.field;
    this.colIndex = 0;
    this.isVisible = ko.observable(false);
    this.width = ko.observable();


    //sorting
    this.allowSort = true;
    this.sortDirection = ko.observable("");

    //filtering
    this.filter = ko.observable();

    //cell Template
    this.cellTemplate = colDef.cellTemplate; // string of the cellTemplate script element id
    this.hasCellTemplate = (this.cellTemplate ? true : false);

    this.cellClass = colDef.cellClass;
    this.headerClass = colDef.headerClass;

    this.headerTemplate = colDef.headerTemplate
    this.hasHeaderTemplate = (this.headerTemplate ? true : false);
        
    // figure out the width
    if (!colDef.width) {
        colDef.width = this.displayName.length * kg.domUtility.letterW;
        colDef.width += 30; //for sorting icons and padding
    }

    this.width(colDef.width);

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
﻿/// <reference path="../utils.js" />
/// <reference path="../namespace.js" />
/// <reference path="../Grid.js" />

kg.Row = function (entity) {
    var self = this;
    this.entity = ko.isObservable(entity) ? entity : ko.observable(entity);
    //selectify the entity
    if (this.entity()['__kg_selected__'] === undefined) {
        this.entity()['__kg_selected__'] = ko.observable(false);
    }

    this.selected = ko.dependentObservable({
        read: function () {
            var val = self.entity()['__kg_selected__']();
            return val;
        },
        write: function (val) {
            self.entity()['__kg_selected__'](val);
            self.onSelectionChanged();
        }
    });

    this.toggleSelected = function (data, event) {
        var element = event.target;

        //check and make sure its not the bubbling up of our checked 'click' event 
        if (element.type == "checkbox" && element.parentElement.className.indexOf("kgSelectionCell" !== -1)) {
            return true;
        } else {
            if (self.selected()) {
                self.selected(false);
            } else {
                self.selected(true);
            }
        }
        return true;
    };

    this.cells = ko.observableArray([]);
    this.cellMap = {};
    this.rowIndex = 0;
    this.offsetTop = 0;
    this.rowKey = utils.newId();
    this.rowDisplayIndex = 0;

    this.onSelectionChanged = function () { }; //replaced in rowManager

    //during row initialization, let's make all the entities properties first-class properties on the row
    (function () {

        utils.forIn(entity, function (prop, propName) {

            self[propName] = prop;

        });

    }());
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
            cell.data = row.entity()[col.field]; //could be observable or not...

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
    var self = this;

    this.colIndex = 0;
    this.displayName = col.displayName;
    this.field = col.field;
    this.column = col;

    this.headerClass = col.headerClass;
    this.headerTemplate = col.headerTemplate;
    this.hasHeaderTemplate = col.hasHeaderTemplate;

    this.width = ko.computed(function () {
        return col.width();
    });

    this.filter = ko.computed({
        read: function () {
            return self.column.filter();
        },
        write: function (val) {
            self.column.filter(val);
        }
    });

    this.filterVisible = ko.observable(false);

    this.sortAscVisible = ko.computed(function () {
        return self.column.sortDirection() === "asc";
    });

    this.sortDescVisible = ko.computed(function () {
        return self.column.sortDirection() === "desc";
    });

    this.noSortVisible = ko.computed(function () {
        var sortDir = self.column.sortDirection();

        return sortDir !== "asc" && sortDir !== "desc";
    });

    this.sort = function () {
        var dir = self.column.sortDirection() === "asc" ? "desc" : "asc";
        self.column.sortDirection(dir);
    };

    this.filterHasFocus = ko.observable(false);
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\HeaderRow.js 
***********************************************/ 
﻿kg.HeaderRow = function () {
    this.headerCells = [];
    this.height;
    this.headerCellMap = {};
    this.filterVisible = ko.observable(false);
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\RowManager.js 
***********************************************/ 
﻿kg.RowManager = function (grid) {
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
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Footer.js 
***********************************************/ 
﻿kg.Footer = function (grid) {
    var self = this;

    this.maxRows;

    if (grid.config.totalServerItems() !== null && grid.config.totalServerItems() !== undefined) {
        this.maxRows = grid.config.totalServerItems; //observable
    } else {
        this.maxRows = grid.maxRows; //observable
    }
    this.selectedItemCount = grid.selectedItemCount; //observable

    this.footerVisible = grid.config.footerVisible;
    this.pagerVisible = ko.observable(grid.config.enablePaging);
    this.selectedPageSize = grid.config.pageSize; //observable
    this.pageSizes = ko.observableArray(grid.config.pageSizes);
    this.currentPage = grid.config.currentPage; //observable
    this.maxPages = ko.computed(function () {
        var maxCnt = self.maxRows() || 1,
            pageSize = self.selectedPageSize();
        return Math.ceil(maxCnt / pageSize);
    });

    this.protectedCurrentPage = ko.computed({
        read: function () {
            return self.currentPage();
        },
        write: function (page) {
            if (page && page <= self.maxPages() && page > 0){
                self.currentPage(page); //KO does an equality check on primitives before notifying subscriptions here
            }
        },
        owner: self
    });

    this.pageForward = function () {
        var page = self.currentPage();
        self.currentPage(Math.min(page + 1, self.maxPages()));
    }

    this.pageBackward = function () {
        var page = self.currentPage();
        self.currentPage(Math.max(page - 1, 1));
    };

    this.pageToFirst = function () {
        self.currentPage(1);
    };

    this.pageToLast = function () {
        var maxPages = self.maxPages();
        self.currentPage(maxPages);
    };

    this.canPageForward = ko.computed(function () {
        var curPage = self.currentPage();
        var maxPages = self.maxPages();
        return curPage < maxPages;
    });

    this.canPageBackward = ko.computed(function () {
        var curPage = self.currentPage();
        return curPage > 1;
    });
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\FilterManager.js 
***********************************************/ 
﻿kg.FilterManager = function (options) {
    var self = this,
        initPhase = 0,
        internalFilteredData = ko.observableArray([]);

    //map of column.field values to filterStrings
    this.filterInfo = options.filterInfo || ko.observable();
    this.data = options.data; //observableArray

    this.filteredData = ko.computed(function () {
        var data = internalFilteredData();

        //this is a bit funky, but it prevents our filtered data from being registered as a subscription to our grid.update bindingHandler
        if (initPhase > 0) {
            return data;
        } else {
            return self.data();
        }
    });

    var filterData = function () {
        var filterInfo = self.filterInfo(),
            data = self.data(),
            keepRow = false,
            match = true,
            newArr = [],
            field,
            itemData,
            itemDataStr,
            filterStr;

        if (!filterInfo || $.isEmptyObject(filterInfo) || options.useExternalFiltering) {
            internalFilteredData(data);
            return;
        }

        newArr = ko.utils.arrayFilter(data, function (item) {

            //loop through each property and filter it
            for (field in filterInfo) {

                if (filterInfo.hasOwnProperty(field)) {
                    itemData = ko.utils.unwrapObservable(item[field]);
                    filterStr = filterInfo[field];

                    if (itemData && filterStr) {
                        filterStr = filterStr.toUpperCase();
                        if (typeof itemData === "string") {
                            itemDataStr = itemData.toUpperCase();
                            match = (itemDataStr.indexOf(filterStr) > -1);
                        } else {
                            itemDataStr = itemData.toString().toUpperCase();
                            match = (itemDataStr.indexOf(filterStr) > -1);
                        }
                    }
                }

                //supports "AND" filtering logic
                if (keepRow && !match) {
                    keepRow = false;
                } else if (!keepRow && match) {
                    keepRow = true; //should only catch on the first pass
                }

                //now if we catch anything thats not a match, break out of the loop
                if (!match) { break; }
            }

            //reset variables
            filterStr = null;
            itemData = null;
            itemDataStr = null;
            match = true;

            return keepRow;
        });

        internalFilteredData(newArr);

    };

    //create subscriptions
    this.data.subscribe(filterData);
    this.filterInfo.subscribe(filterData);

    this.createFilterChangeCallback = function (col) {
        return function (newFilterVal) {
            var info = self.filterInfo();

            if (!info && !newFilterVal) {
                return;
            }

            //if we're still here, we may need to new up the info
            if (!info) { info = {}; }

            if ((newFilterVal === null ||
                newFilterVal === undefined ||
                newFilterVal === "") &&
                info[col.field]) { //null or undefined
                //smoke it so we don't loop through it for filtering anymore!
                delete info[col.field];

            } else if (newFilterVal !== null && newFilterVal !== undefined) {

                info[col.field] = newFilterVal;

            }
            self.filterInfo(info);
        };
    };

    //increase this after initialization so that the computeds fire correctly
    initPhase = 1;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\SortManager.js 
***********************************************/ 
﻿kg.SortManager = function (options) {
    var self = this,
        colSortFnCache = {},
        dateRE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/,
        ASC = "asc",
        DESC = "desc",
        prevSortInfo = {},
        dataSource = options.data, //observableArray
        initPhase = 0,
        internalSortedData = ko.observableArray([]);

    var isNull = function (val) {
        return (val === null || val === undefined);
    };

    this.sortInfo = options.sortInfo || ko.observable();

    this.sortedData = ko.computed(function () {
        var sortData = internalSortedData();
        //We have to do this because any observable that is invoked inside of a bindingHandler (init or update) is registered as a 
        // dependency during the binding handler's dependency detection :(
        if (initPhase > 0) {
            return sortData;
        } else {
            return dataSource();
        }
    });

    this.guessSortFn = function (item) {
        var sortFn,
            itemStr,
            itemType,
            dateParts,
            month,
            day;

        if (item === undefined || item === null || item === '') {
            return null;
        }

        itemType = typeof (item);

        //check for numbers and booleans
        switch (itemType) {
            case "number":
                sortFn = self.sortNumber;
                break;
            case "boolean":
                sortFn = self.sortBool;
                break;
        }

        //if we found one, return it
        if (sortFn) {
            return sortFn;
        }

        //check if the item is a valid Date
        if (Object.prototype.toString.call(item) === '[object Date]') {
            return self.sortDate;
        }

        // if we aren't left with a string, we can't sort full objects...
        if (itemType !== "string") {
            return null;
        }

        // now lets string check..

        //check if the item data is a valid number
        if (item.match(/^-?[£$¤]?[\d,.]+%?$/)) {
            return self.sortNumberStr;
        }

        // check for a date: dd/mm/yyyy or dd/mm/yy 
        // can have / or . or - as separator
        // can be mm/dd as well
        dateParts = item.match(dateRE)
        if (dateParts) {
            // looks like a date
            month = parseInt(dateParts[1]);
            day = parseInt(dateParts[2]);
            if (month > 12) {
                // definitely dd/mm
                return self.sortDDMMStr;
            } else if (day > 12) {

                return self.sortMMDDStr;
            } else {
                // looks like a date, but we can't tell which, so assume that it's MM/DD
                return self.sortMMDDStr;
            }
        }

        //finally just sort the normal string...
        return self.sortAlpha;

    };

    this.sortNumber = function (a, b) {

        return a - b;
    };

    this.sortNumberStr = function (a, b) {
        var numA, numB;

        numA = parseFloat(a.replace(/[^0-9.-]/g, ''));
        if (isNaN(numA)) {
            numA = 0;
        }
        numB = parseFloat(b.replace(/[^0-9.-]/g, ''));
        if (isNaN(numB)) {
            numB = 0;
        }
        return numA - numB;
    };

    this.sortAlpha = function (a, b) {
        var strA = a.toUpperCase(),
            strB = b.toUpperCase();

        return strA == strB ? 0 : (strA < strB ? -1 : 1);
    };

    this.sortDate = function (a, b) {
        var timeA = a.getTime(),
            timeB = b.getTime();

        return timeA == timeB ? 0 : (timeA < timeB ? -1 : 1);
    };

    this.sortBool = function (a, b) {
        if (a && b) { return 0; }
        if (!a && !b) { return 0; }
        else { return a ? 1 : -1 }
    };

    this.sortDDMMStr = function (a, b) {
        var dateA, dateB, mtch,
            m, d, y;

        mtch = a.match(dateRE);
        y = mtch[3]; m = mtch[2]; d = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateA = y + m + d;
        mtch = b.match(dateRE);
        y = mtch[3]; m = mtch[2]; d = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateB = y + m + d;
        if (dateA == dateB) return 0;
        if (dateA < dateB) return -1;
        return 1;
    };

    this.sortMMDDStr = function (a, b) {
        var dateA, dateB, mtch,
            m, d, y;

        mtch = a.match(dateRE);
        y = mtch[3]; d = mtch[2]; m = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateA = y + m + d;
        mtch = b.match(dateRE);
        y = mtch[3]; d = mtch[2]; m = mtch[1];
        if (m.length == 1) m = '0' + m;
        if (d.length == 1) d = '0' + d;
        dateB = y + m + d;
        if (dateA == dateB) return 0;
        if (dateA < dateB) return -1;
        return 1;
    };


    this.sort = function (col, direction) {
        //do an equality check first
        if (col === prevSortInfo.column && direction === prevSortInfo.direction) {
            return;
        }

        //if its not equal, set the observable and kickoff the event chain
        self.sortInfo({
            column: col,
            direction: direction
        });
    };

    var sortData = function () {
        var data = dataSource(),
            sortInfo = self.sortInfo(),
            col,
            direction,
            sortFn,
            item,
            prop;

        if (!data || !sortInfo || options.useExternalSorting) {
            internalSortedData(data);
            return;
        }

        col = sortInfo.column;
        direction = sortInfo.direction;

        //see if we already figured out what to use to sort the column
        if (colSortFnCache[col.field]) {
            sortFn = colSortFnCache[col.field];
        } else { // try and guess what sort function to use
            item = dataSource()[0];

            if (item) {
                prop = ko.utils.unwrapObservable(item[col.field]);
            }

            sortFn = self.guessSortFn(prop);

            //cache it
            if (sortFn) {
                colSortFnCache[col.field] = sortFn;
            } else {
                return;
            }
        }

        //now actually sort the data
        data.sort(function (itemA, itemB) {
            var propA = ko.utils.unwrapObservable(itemA[col.field]),
                propB = ko.utils.unwrapObservable(itemB[col.field]),
                propANull = isNull(propA),
                propBNull = isNull(propB);

            if (propANull && propBNull) {
                return 0;
            } else if (propANull) {
                return 1;
            } else if (propBNull) {
                return -1;
            }

            //made it this far, we don't have to worry about null & undefined
            if (direction === ASC) {
                return sortFn(propA, propB);
            } else {
                return 0 - sortFn(propA, propB);
            }
        });

        internalSortedData(data);
    };

    //subscribe to the changes in these objects
    dataSource.subscribe(sortData);
    this.sortInfo.subscribe(sortData);

    //change the initPhase so computed bindings now work!
    initPhase = 1;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\SelectionManager.js 
***********************************************/ 
﻿/******************************
* Use cases to support:
* 1. Always keep a selectedItem in single select mode
*   - first item is selected by default (if selection is enabled)
* 2. Don't keep both selectedItem/selectedItems in sync - pick one
* 3. Remember selectedIndex, and if user deletes an item in the array - reselect the next index
* 4. If Single Select, don't pick a selected item on first data load
*/

kg.SelectionManager = function (options) {
    var self = this,
        isMulti = options.isMultiSelect,
        dataSource = options.data,
        KEY = '__kg_selected__',
        maxRows = ko.computed(function () {
            return dataSource().length;
        });

    this.selectedItem = options.selectedItem; //observable
    this.selectedItems = options.selectedItems; //observableArray
    this.selectedIndex = options.selectedIndex; //observable

    this.selectedItemCount = ko.computed(function () {
        var single = self.selectedItem(),
            arr = self.selectedItems();

        if (!isMulti) {
            return (single !== null && single !== undefined) ? 1 : 0; //truthy statement
        } else {
            return arr.length;
        }
    });

    this.selectedItem.subscribe(function (currentEntity) {
        //ensure outgoing entity is de-selected
        if (!isMulti) {
            //uncheck the current entity
            if (currentEntity && currentEntity[KEY]) {
                currentEntity[KEY](false);
            }
        }
    }, self, "beforeChange");

    this.selectedItem.subscribe(function (entity) {
        //ensure incoming entity has our selected flag
        if (entity && !entity[KEY]) {
            entity[KEY] = ko.observable(true);
        } else if (entity) {
            entity[KEY](true);
        }
    });

    this.selectedItems.subscribe(function (newItems) {
        if (!newItems) {
            newItems = [];
        }

        utils.forEach(dataSource(), function (item, i) {

            if (!item[KEY]) {
                item[KEY] = ko.observable(false);
            }

            if (ko.utils.arrayIndexOf(newItems, item) > -1) {
                //newItems contains the item
                item[KEY](true);
            } else {
                item[KEY](false);
            }

        });
    });

    this.changeSelectedItem = function (changedEntity) {
        var currentEntity = self.selectedItem(),
            currentItems = self.selectedItems,
            len = 0,
            keep = false;

        if (!isMulti) {
            //Single Select Logic

            //find out if the changed entity is selected or not
            if (changedEntity && changedEntity[KEY]) {
                keep = changedEntity[KEY]();
            }

            if (keep) {
                //set the new entity
                self.selectedItem(changedEntity);
            } else {
                //always keep a selected entity around
                changedEntity[KEY](true);
            }

        } else {
            //Multi-Select Logic
            len = currentItems().length;

            //if the changed entity was de-selected, remove it from the array
            if (changedEntity && changedEntity[KEY]) {
                keep = changedEntity[KEY]();
            }

            if (!keep) {
                currentItems.remove(changedEntity);
            } else {
                //first see if it exists, if not add it
                if (currentItems.indexOf(changedEntity) === -1) {
                    currentItems.push(changedEntity);
                }
            }
        }
    };

    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!isMulti) {
                return cnt === 1;
            }
            if (maxRows() === 0) {
                return false;
            }
            return cnt === maxRows();
        },
        write: function (val) {
            var checkAll = val,
                selectedItemsToPush = [],
                data;

            if (isMulti) {
                data = dataSource();

                if (checkAll) {
                    self.selectedItems(data);
                } else {
                    self.selectedItems([]);
                }
            }
        }
    });

    //make sure as the data changes, we keep the selectedItem(s) correct
    dataSource.subscribe(function (items) {
        var selectedItems, selectedItem, itemsToRemove;

        if (!items) {
            return;
        }

        //make sure the selectedItem/Items exist in the new data
        if (isMulti) {
            selectedItems = self.selectedItems();
            itemsToRemove = [];

            ko.utils.arrayForEach(selectedItems, function (item) {
                if (ko.utils.arrayIndexOf(items, item) < 0) {
                    itemsToRemove.push(item);
                }
            });

            //clean out any selectedItems that don't exist in the new array
            if (itemsToRemove.length > 0) {
                self.selectedItems.removeAll(itemsToRemove);
            }

        } else {
            selectedItem = self.selectedItem();

            if (selectedItem && ko.utils.arrayIndexOf(items, selectedItem) < 0) {
                self.selectedItem(items[0] ? items[0] : null);
            }
        }
    });
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridManager.js 
***********************************************/ 
﻿kg.gridManager = (new function () {
    var self = this,
        elementGridKey = '__koGrid__';

    //#region Public Properties
    this.gridCache = {};

    //#endregion

    //#region Public Methods
    this.storeGrid = function (element, grid) {
        self.gridCache[grid.gridId] = grid;
        element[elementGridKey] = grid.gridId;
    };

    this.getGrid = function (element) {
        var grid;

        if (element[elementGridKey]) {
            grid = self.gridCache[element[elementGridKey]];
        }

        return grid;
    };

    this.clearGridCache = function () {
        self.gridCache = {};
    };

    this.assignGridEventHandlers = function (grid) {

        grid.$viewport.scroll(function (e) {
            var scrollLeft = e.target.scrollLeft,
                scrollTop = e.target.scrollTop;

            grid.adjustScrollLeft(scrollLeft);
            grid.adjustScrollTop(scrollTop);
        });

        //resize the grid on window re-size events

        $(window).resize(function () {
            var prevSizes = {
                rootMaxH: grid.elementDims.rootMaxH,
                rootMaxW: grid.elementDims.rootMaxW,
                rootMinH: grid.elementDims.rootMinH,
                rootMinW: grid.elementDims.rootMinW
            },
            scrollTop = 0,
            isDifferent = false;
            
            //catch this so we can return the viewer to their original scroll after the resize!
            scrollTop = grid.$viewport.scrollTop();

            kg.domUtility.measureGrid(grid.$root, grid);

            //check to see if anything has changed
            if (prevSizes.rootMaxH !== grid.elementDims.rootMaxH) {
                isDifferent = true;
            } else if (prevSizes.rootMaxW !== grid.elementDims.rootMaxW) {
                isDifferent = true;
            } else if (prevSizes.rootMinH !== grid.elementDims.rootMinH) {
                isDifferent = true;
            } else if (prevSizes.rootMinW !== grid.elementDims.rootMinW) {
                isDifferent = true;
            } else {
                return;
            }

            if (isDifferent) {

                grid.refreshDomSizes();

                grid.adjustScrollTop(scrollTop, true); //ensure that the user stays scrolled where they were
            }
        });
    };
    //#endregion
} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\Grid.js 
***********************************************/ 
﻿/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 30,
        columnWidth: 100,
        headerRowHeight: 30,
        footerRowHeight: 55,
        filterRowHeight: 30,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        headerCellTemplate: 'kgHeaderCellTemplate',
        footerTemplate: 'kgFooterTemplate',
        footerVisible: ko.observable(true),
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: [],
        pageSizes: [250, 500, 1000], //page Sizes
        enablePaging: false,
        pageSize: ko.observable(250), //Size of Paging data
        totalServerItems: ko.observable(), //ko.observable of how many items are on the server (for paging)
        currentPage: ko.observable(1), //ko.observable of what page they are currently on
        selectedItem: ko.observable(), //ko.observable
        selectedItems: ko.observableArray([]), //ko.observableArray
        selectedIndex: ko.observable(0), //observable of the index of the selectedItem in the data array
        isMultiSelect: true, //toggles between selectedItem & selectedItems
        displaySelectionCheckbox: true, //toggles whether row selection check boxes appear
        displayRowIndex: true, //shows the rowIndex cell at the far left of each row
        useExternalFiltering: false,
        useExternalSorting: false,
        filterInfo: ko.observable(), //observable that holds filter information (fields, and filtering strings)
        sortInfo: ko.observable() //observable similar to filterInfo
    },

    self = this,
    filterIsOpen = ko.observable(false), //observable so that the header can subscribe and change height when opened
    filterManager, //kg.FilterManager
    sortManager, //kg.SortManager
    selectionManager,
    isSorting = false,
    prevScrollTop,
    prevScrollLeft,
    prevMinRowsToRender,
    maxCanvasHt = 0,
    h_updateTimeout;

    this.$root; //this is the root element that is passed in with the binding handler
    this.$topPanel;
    this.$headerContainer;
    this.$headerScroller;
    this.$headers;
    this.$viewport;
    this.$canvas;
    this.$footerPanel;

    this.config = $.extend(defaults, options)
    this.gridId = "kg" + kg.utils.newId();
    this.initPhase = 0;


    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;

    filterManager = new kg.FilterManager(self.config);
    sortManager = new kg.SortManager({
        data: filterManager.filteredData,
        sortInfo: self.config.sortInfo,
        useExternalSorting: self.config.useExternalFiltering
    });

    this.sortInfo = sortManager.sortInfo; //observable
    this.filterInfo = filterManager.filterInfo; //observable
    this.finalData = sortManager.sortedData; //observable Array
    this.canvasHeight = ko.observable(maxCanvasHt.toString() + 'px');

    selectionManager = new kg.SelectionManager({
        isMultiSelect: self.config.isMultiSelect,
        data: self.finalData,
        selectedItem: self.config.selectedItem,
        selectedItems: self.config.selectedItems,
        selectedIndex: self.config.selectedIndex
    });

    this.maxRows = ko.computed(function () {
        var rows = self.finalData();
        maxCanvasHt = rows.length * self.config.rowHeight;
        self.canvasHeight(maxCanvasHt.toString() + 'px');
        return rows.length || 0;
    });

    this.maxCanvasHeight = function () {
        return maxCanvasHt || 0;
    };

    this.selectedItemCount = selectionManager.selectedItemCount;

    this.columns = new kg.ColumnCollection();

    //initialized in the init method
    this.rowManager;
    this.rows;
    this.headerRow;
    this.footer;

    this.elementDims = {
        scrollW: 0,
        scrollH: 0,
        cellHdiff: 0,
        cellWdiff: 0,
        rowWdiff: 0,
        rowHdiff: 0,
        rowIndexCellW: 35,
        rowSelectedCellW: 25,
        rootMaxW: 0,
        rootMaxH: 0,
        rootMinW: 0,
        rootMinH: 0
    };
    this.elementsNeedMeasuring = true;

    //#region Container Dimensions

    this.rootDim = ko.observable(new kg.Dimension({ outerHeight: 20000, outerWidth: 20000 }));

    this.headerDim = ko.computed(function () {
        var rootDim = self.rootDim(),
            filterOpen = filterIsOpen(),
            newDim = new kg.Dimension();

        newDim.outerHeight = self.config.headerRowHeight;
        newDim.outerWidth = rootDim.outerWidth;

        if (filterOpen) {
            newDim.outerHeight += self.config.filterRowHeight;
        }

        return newDim;
    });

    this.footerDim = ko.computed(function () {
        var rootDim = self.rootDim(),
            showFooter = self.config.footerVisible(),
            newDim = new kg.Dimension();

        newDim.outerHeight = self.config.footerRowHeight;
        newDim.outerWidth = rootDim.outerWidth;

        if (!showFooter) {
            newDim.outerHeight = 3;
        }

        return newDim;
    });

    this.viewportDim = ko.computed(function () {
        var rootDim = self.rootDim(),
            headerDim = self.headerDim(),
            footerDim = self.footerDim(),
            newDim = new kg.Dimension();

        newDim.outerHeight = rootDim.outerHeight - headerDim.outerHeight - footerDim.outerHeight;
        newDim.outerWidth = rootDim.outerWidth;
        newDim.innerHeight = newDim.outerHeight;
        newDim.innerWidth = newDim.outerWidth;

        return newDim;
    });

    this.totalRowWidth = ko.computed(function () {
        var width = 0,
            cols = self.columns();

        utils.forEach(cols, function (col, i) {
            width += col.width();
        });

        return width;
    });

    this.minRowsToRender = ko.computed(function () {
        var viewportH = self.viewportDim().outerHeight || 1;

        if (filterIsOpen()) {
            return prevMinRowsToRender;
        };

        prevMinRowsToRender = Math.floor(viewportH / self.config.rowHeight);

        return prevMinRowsToRender;
    });


    this.headerScrollerDim = ko.computed(function () {
        var viewportH = self.viewportDim().outerHeight,
            filterOpen = filterIsOpen(), //register this observable
            maxHeight = self.maxCanvasHeight(),
            vScrollBarIsOpen = (maxHeight > viewportH),
            hScrollBarIsOpen = (self.viewportDim().outerWidth < self.totalRowWidth())
        newDim = new kg.Dimension();

        newDim.autoFitHeight = true;
        newDim.outerWidth = self.totalRowWidth();

        if (vScrollBarIsOpen) { newDim.outerWidth += self.elementDims.scrollW; }
        else if ((maxHeight - viewportH) <= self.elementDims.scrollH) { //if the horizontal scroll is open it forces the viewport to be smaller
            newDim.outerWidth += self.elementDims.scrollW;
        }
        return newDim;
    });

    //#endregion

    //#region Events
    this.changeSelectedItem = selectionManager.changeSelectedItem;
    this.toggleSelectAll = selectionManager.toggleSelectAll;

    this.sortData = function (col, dir) {
        isSorting = true;

        utils.forEach(self.columns(), function (column) {
            if (column.field !== col.field) {
                if (column.sortDirection() !== "") { column.sortDirection(""); }
            }
        });

        sortManager.sort(col, dir);

        isSorting = false;
    };

    //#endregion



    //keep selected item scrolled into view
    this.finalData.subscribe(function () {
        var item;

        if (self.config.isMultiSelect && self.config.selectedItems()) {
            item = self.config.selectedItems()[0];
        } else if (self.config.selectedItem()) {
            item = self.config.selectedItem();
        }

        if (item) {
            scrollIntoView(item);
        }
    });

    var scrollIntoView = function (entity) {
        var itemIndex,
            viewableRange = self.rowManager.viewableRange();

        if (entity) {
            itemIndex = ko.utils.arrayIndexOf(self.finalData(), entity);
        }

        if (itemIndex > -1) {
            //check and see if its already in view!
            if (itemIndex > viewableRange.topRow || itemIndex < viewableRange.bottomRow - 5) {

                //scroll it into view
                self.rowManager.viewableRange(new kg.Range(itemIndex, itemIndex + self.minRowsToRender()));

                if (self.$viewport) {
                    self.$viewport.scrollTop(itemIndex * self.config.rowHeight);
                }
            }
        };
    };

    this.refreshDomSizes = function () {
        var dim = new kg.Dimension(),
            oldDim = self.rootDim(),
            rootH = 0,
            rootW = 0,
            canvasH = 0;

        self.elementsNeedMeasuring = true;

        //calculate the POSSIBLE biggest viewport height
        rootH = self.maxCanvasHeight() + self.config.headerRowHeight + self.config.footerRowHeight;

        //see which viewport height will be allowed to be used
        rootH = Math.min(self.elementDims.rootMaxH, rootH);
        rootH = Math.max(self.elementDims.rootMinH, rootH);

        //now calc the canvas height of what is going to be used in rendering
        canvasH = rootH - self.config.headerRowHeight - self.config.footerRowHeight;

        //get the max row Width for rendering
        rootW = self.totalRowWidth() + self.elementDims.rowWdiff;

        //now see if we are going to have a vertical scroll bar present
        if (self.maxCanvasHeight() > canvasH) {

            //if we are, then add that width to the max width 
            rootW += self.elementDims.scrollW || 0;
        }

        //now see if we are constrained by any width dimensions
        dim.outerWidth = Math.min(self.elementDims.rootMaxW, rootW);
        dim.outerWidth = Math.max(self.elementDims.rootMinW, dim.outerWidth);

        dim.outerHeight = rootH;

        //finally don't fire the subscriptions if we aren't changing anything!
        if (dim.outerHeight !== oldDim.outerHeight || dim.outerWidth !== oldDim.outerWidth) {

            //if its not the same, then fire the subscriptions
            self.rootDim(dim);
        }
    };

    this.refreshDomSizesTrigger = ko.computed(function () {
        //register dependencies
        var data = self.data();

        if (h_updateTimeout) {
            if (window.setImmediate) {
                window.clearImmediate(h_updateTimeout);
            } else {
                window.clearTimeout(h_updateTimeout);
            }
        }

        if (self.initPhase > 0) {

            //don't shrink the grid if we sorting or filtering
            if (!filterIsOpen() && !isSorting) {

                self.refreshDomSizes();

                kg.cssBuilder.buildStyles(self);

                if (self.initPhase > 0 && self.$root) {
                    self.$root.show();
                }
            }
        }

    });

    var buildColumnDefsFromData = function () {
        var item;

        if (!self.data() || !self.data()[0]) {
            throw 'If auto-generating columns, "data" cannot be of null or undefined type!';
        }

        item = self.data()[0];

        utils.forIn(item, function (prop, propName) {
            if (propName === '__kg_selected__') {
                return;
            }

            self.config.columnDefs.push({
                field: propName
            });
        });

    };

    var buildColumns = function () {
        var columnDefs = self.config.columnDefs,
            cols = [],
            column;

        if (self.config.autogenerateColumns) { buildColumnDefsFromData(); }

        if (self.config.displaySelectionCheckbox) {
            columnDefs.splice(0, 0, { field: '__kg_selected__', width: self.elementDims.rowSelectedCellW });
        }
        if (self.config.displayRowIndex) {
            columnDefs.splice(0, 0, { field: 'rowIndex', width: self.elementDims.rowIndexCellW });
        }

        var createColumnSortClosure = function (col) {
            return function (dir) {
                if (dir) {
                    self.sortData(col, dir);
                }
            }
        }

        if (columnDefs.length > 1) {

            utils.forEach(columnDefs, function (colDef, i) {
                column = new kg.Column(colDef);
                column.index = i;

                column.sortDirection.subscribe(createColumnSortClosure(column));

                column.filter.subscribe(filterManager.createFilterChangeCallback(column));

                cols.push(column);
            });

            self.columns(cols);
        }
    };

    this.init = function () {

        buildColumns();

        //now if we are using the default templates, then make the generated ones unique
        if (self.config.rowTemplate === 'kgRowTemplate') {
            self.config.rowTemplate = self.gridId + self.config.rowTemplate;
        }

        if (self.config.headerTemplate === 'kgHeaderRowTemplate') {
            self.config.headerTemplate = self.gridId + self.config.headerTemplate;
        }

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable

        kg.cssBuilder.buildStyles(self);

        self.initPhase = 1;
    };

    this.update = function () {
        //we have to update async, or else all the observables are registered as dependencies

        var updater = function () {

            self.refreshDomSizes();

            kg.cssBuilder.buildStyles(self);

            if (self.initPhase > 0 && self.$root) {
                self.$root.show();
            }
        };

        if (window.setImmediate) {
            h_updateTimeout = setImmediate(updater);
        } else {
            h_updateTimeout = setTimeout(updater, 0);
        }
    };

    this.showFilter_Click = function () {
        var isOpen = (filterIsOpen() ? false : true);

        self.headerRow.filterVisible(isOpen);

        filterIsOpen(isOpen);
    };

    this.clearFilter_Click = function () {
        utils.forEach(self.columns(), function (col, i) {
            col.filter(null);
        });
    };

    this.adjustScrollTop = function (scrollTop, force) {
        var rowIndex;

        if (prevScrollTop === scrollTop && !force) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.minRowsToRender()));
    };

    this.adjustScrollLeft = function (scrollLeft) {
        if (self.$headerContainer) {
            self.$headerContainer.scrollLeft(scrollLeft);
        }
    };

    //call init
    self.init();
}; 
 
 
/*********************************************** 
* FILE: ..\Src\DomManipulation\CssBuilder.js 
***********************************************/ 
﻿/// <reference path="../../lib/jquery-1.7.js" />
/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../KoGrid.js" />

kg.cssBuilder = {

    buildStyles: function (grid) {
        var rowHeight = (grid.config.rowHeight - grid.elementDims.rowHdiff),
            $style = grid.$styleSheet,
            gridId = grid.gridId,
            rules,
            i = 0,
            len = grid.columns().length,
            css = new kg.utils.StringBuilder(),
            col,
            sumWidth = 0,
            colWidth;

        if (!$style) {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($('head'));
        }
        $style.empty();
        
        css.append(".{0} .kgCanvas { width: {1}px; }", gridId, grid.totalRowWidth());
        css.append(".{0} .kgCell { height: {1}px; }", gridId, rowHeight);
        css.append(".{0} .kgRow { position: absolute; left: 0; right: 0; height: {1}px; line-height: {1}px; display: inline; }", gridId, rowHeight);
        css.append(".{0} .kgHeaderCell { top: 0; bottom: 0; }", gridId, rowHeight);
        css.append(".{0} .kgHeaderScroller { line-height: {1}px; overflow: none; }", gridId, rowHeight);

        for (; i < len; i++) {
            col = grid.columns()[i];
            
            colWidth = col.width() - grid.elementDims.cellWdiff;

            css.append(".{0} .col{1} { left: {2}px; right: {3}px; width: {4}px; }", gridId, i, sumWidth, (grid.totalRowWidth() - sumWidth - col.width()), colWidth);

            sumWidth += col.width();

        }

        if ($style[0].styleSheet) { // IE
            $style[0].styleSheet.cssText = css.toString(" ");
        }
        else {
            $style[0].appendChild(document.createTextNode(css.toString(" ")));
        }

        grid.$styleSheet = $style;
    }
}; 
 
 
/*********************************************** 
* FILE: ..\Src\DomManipulation\DomUtility.js 
***********************************************/ 
﻿kg.domUtility = (new function () {
    var $testContainer = $('<div></div>'),
        self = this;

    this.assignGridContainers = function (rootEl, grid) {

        grid.$root = $(rootEl);

        //Headers
        grid.$topPanel = $(".kgTopPanel", grid.$root[0]);
        grid.$headerContainer = $(".kgHeaderContainer", grid.$topPanel[0]);
        grid.$headerScroller = $(".kgHeaderScroller", grid.$headerContainer[0]);
        grid.$headers = grid.$headerContainer.children();

        //Viewport
        grid.$viewport = $(".kgViewport", grid.$root[0]);

        //Canvas
        grid.$canvas = $(".kgCanvas", grid.$viewport[0]);

        //Footers
        grid.$footerPanel = $(".kgFooterPanel", grid.$root[0]);
    };

    this.measureElementMaxDims = function ($container) {
        var dims = {};

        var $test = $("<div style='height: 20000px; width: 20000px;'></div>");

        $container.append($test);

        dims.maxWidth = $container.width();
        dims.maxHeight = $container.height();

        //if they are zero, see what the parent's size is
        if (dims.maxWidth === 0) {
            dims.maxWidth = $container.parent().width();
        }
        if (dims.maxHeight === 0) {
            dims.maxHeight = $container.parent().height();
        }

        $test.remove();

        return dims;
    };

    this.measureElementMinDims = function ($container) {
        var dims = {},
            $testContainer = $container.clone();

        $testContainer.appendTo($container.parent().first());

        dims.minWidth = 0;
        dims.minHeight = 0;

        //since its cloned... empty it out
        $testContainer.empty();

        var $test = $("<div style='height: 0x; width: 0px;'></div>");
        $testContainer.append($test);

        //$testContainer.wrap("<div style='width: 1px; height: 1px;'></div>");

        dims.minWidth = $testContainer.width();
        dims.minHeight = $testContainer.height();

        //This will blip the screen, so make sure to reset scroll bars, etc...
        //$testContainer.unwrap();
        $testContainer.remove();

        return dims;
    };

    this.measureGrid = function ($container, grid, measureMins) {

        //find max sizes
        var dims = self.measureElementMaxDims($container);

        grid.elementDims.rootMaxW = dims.maxWidth;
        grid.elementDims.rootMaxH = dims.maxHeight;

        //set scroll measurements
        grid.elementDims.scrollW = kg.domUtility.scrollW;
        grid.elementDims.scrollH = kg.domUtility.scrollH;

        //find min sizes
        dims = self.measureElementMinDims($container);

        grid.elementDims.rootMinW = dims.minWidth;

        // do a little magic here to ensure we always have a decent viewport
        dims.minHeight = Math.max(dims.minHeight, (grid.config.headerRowHeight + grid.config.footerRowHeight + (3 * grid.config.rowHeight)));
        dims.minHeight = Math.min(grid.elementDims.rootMaxH, dims.minHeight);

        grid.elementDims.rootMinH = dims.minHeight;
    };

    this.measureRow = function ($canvas, grid) {
        var $row,
            $cell,
            isDummyRow,
            isDummyCell;

        $row = $canvas.children().first();
        if ($row.length === 0) {
            //add a dummy row
            $canvas.append('<div class="kgRow"></div>');
            $row = $canvas.children().first();
            isDummyRow = true;
        }

        $cell = $row.children().first();
        if ($cell.length === 0) {
            //add a dummy cell
            $row.append('<div class="kgCell col0"></div>');
            $cell = $row.children().first();
            isDummyCell = true;
        }

        grid.elementDims.rowWdiff = $row.outerWidth() - $row.width();
        grid.elementDims.rowHdiff = $row.outerHeight() - $row.height();

        grid.elementDims.cellWdiff = $cell.outerWidth() - $cell.width();
        grid.elementDims.cellHdiff = $cell.outerHeight() - $cell.height();

        grid.elementsNeedMeasuring = false;

        if (isDummyRow) {
            $row.remove();
        } else if (isDummyCell) {
            $cell.remove();
        }
    };

    this.scrollH = 17; // default in IE, Chrome, & most browsers
    this.scrollW = 17; // default in IE, Chrome, & most browsers
    this.letterW = 5;

    $(function () {
        $testContainer.appendTo('body');
        // 1. Run all the following measurements on startup!

        //measure Scroll Bars
        $testContainer.height(100).width(100).css("position", "absolute").css("overflow", "scroll");
        $testContainer.append('<div style="height: 400px; width: 400px;"></div>');

        self.scrollH = ($testContainer.height() - $testContainer[0].clientHeight);
        self.scrollW = ($testContainer.width() - $testContainer[0].clientWidth);

        $testContainer.empty();

        //clear styles
        $testContainer.attr('style', '');

        //measure letter sizes using a pretty typical font size and fat font-family
        $testContainer.append('<span style="font-family: Verdana, Helvetica, Sans-Serif; font-size: 14px;"><strong>M</strong></span>');

        self.letterW = $testContainer.children().first().width();

        $testContainer.remove();
    });

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\kgWith.js 
***********************************************/ 
﻿
// This binding only works if the object that you want
// use as the context of child bindings DOESN't change.
// It is useful for us here since many of the grids properties
// don't actually change, and thus this really just helps create
// more readable and manageable code
ko.bindingHandlers['kgWith'] = (function () {

    return {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var val = ko.utils.unwrapObservable(valueAccessor()),
                newContext = bindingContext.createChildContext(val);

            //we don't want bad binding contexts bc all the child bindings will blow up
            if (!val) { throw Error("Cannot use a null or undefined value with the 'kgWith' binding"); }

            //now cascade the new binding context throughout child elements...
            ko.applyBindingsToDescendants(newContext, element);

            return { 'controlsDescendantBindings': true };
        }
    };
} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGrid.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGrid'] = (function () {
    var makeNewValueAccessor = function (grid) {
        return function () {
            return {
                name: GRID_TEMPLATE,
                data: grid
            };
        };
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                options = valueAccessor(),
                $element = $(element);

            //create the Grid
            grid = new kg.KoGrid(options);

            kg.gridManager.storeGrid(element, grid);

            //get the container sizes
            kg.domUtility.measureGrid($element, grid, true);

            $element.hide(); //first hide the grid so that its not freaking the screen out

            //set the right styling on the container
            $(element).addClass("kgGrid")
                      .addClass("ui-widget")
                      .addClass(grid.gridId.toString());

            //make sure the templates are generated for the Grid
            kg.templateManager.ensureGridTemplates({
                rowTemplate: grid.config.rowTemplate,
                headerTemplate: grid.config.headerTemplate,
                headerCellTemplate: grid.config.headerCellTemplate,
                footerTemplate: grid.config.footerTemplate,
                columns: grid.columns(),
                showFilter: grid.config.allowFiltering
            });

            return ko.bindingHandlers['template'].init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                returnVal;

            grid = kg.gridManager.getGrid(element);

            //kind a big problem if this isn't here...
            if (!grid) {
                return { 'controlsDescendantBindings': true };
            }

            //fire the with "update" bindingHandler
            returnVal = ko.bindingHandlers['template'].update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);

            //walk the element's graph and the correct properties on the grid
            kg.domUtility.assignGridContainers(element, grid);

            //now use the manager to assign the event handlers
            kg.gridManager.assignGridEventHandlers(grid);

            //call update on the grid, which will refresh the dome measurements asynchronously
            grid.update();

            return returnVal;
        }
    };

} ());
 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\kgRows.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgRows'] = (function () {

    var RowSubscription = function () {
        this.rowKey;
        this.rowIndex;
        this.node;
        this.subscription;
    };

    // figures out what rows already exist in DOM and 
    // what rows need to be added as new DOM nodes
    //
    // the 'currentNodeCache' is dictionary of currently existing
    // DOM nodes indexed by rowIndex
    var compareRows = function (rows, rowSubscriptions) {
        rowMap = {},
        newRows = [],
        rowSubscriptionsToRemove = [];

        //figure out what rows need to be added
        ko.utils.arrayForEach(rows, function (row) {
            rowMap[row.rowIndex] = row;

            // make sure that we create new rows when sorting/filtering happen.
            // The rowKey tells us whether the row for that rowIndex is different or not
            var possibleRow = rowSubscriptions[row.rowIndex];
            if (!possibleRow) {
                newRows.push(row);
            } else if (possibleRow.rowKey !== row.rowKey) {
                newRows.push(row);
            }
        });

        //figure out what needs to be deleted
        utils.forIn(rowSubscriptions, function (rowSubscription, index) {

            //get the row we might be able to compare to
            var compareRow = rowMap[index];

            // if there is no compare row, we want to remove the row from the DOM
            // if there is a compare row and the rowKeys are different, we want to remove from the DOM
            //  bc its most likely due to sorting etc..
            if (!compareRow) {
                rowSubscriptionsToRemove.push(rowSubscription);
            } else if (compareRow.rowKey !== rowSubscription.rowKey) {
                rowSubscriptionsToRemove.push(rowSubscription);
            }
        });

        return {
            add: newRows,
            remove: rowSubscriptionsToRemove
        };
    };


    return {
        init: function () {

            return { 'controlsDescendantBindings': true };
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var rowManager = bindingContext.$data.rowManager,
                rows = ko.utils.unwrapObservable(valueAccessor()),
                grid = bindingContext.$data,
                rowChanges;

            //figure out what needs to change
            rowChanges = compareRows(rows, rowManager.rowSubscriptions || {});
            
            // FIRST!! We need to remove old ones in case we are sorting and simply replacing the data at the same rowIndex            
            ko.utils.arrayForEach(rowChanges.remove, function (rowSubscription) {

                if (rowSubscription.node) {
                    ko.removeNode(rowSubscription.node);
                }

                rowSubscription.subscription.dispose();

                delete rowManager.rowSubscriptions[rowSubscription.rowIndex];
            });

            // and then we add the new row after removing the old rows
            ko.utils.arrayForEach(rowChanges.add, function (row) {
                var newBindingCtx,
                    rowSubscription,
                    divNode = document.createElement('DIV');

                //make sure the bindingContext of the template is the row and not the grid!
                newBindingCtx = bindingContext.createChildContext(row);

                //create a node in the DOM to replace, because KO doesn't give us a good hook to just do this...
                element.appendChild(divNode);

                //create a row subscription to add data to
                rowSubscription = new RowSubscription();
                rowSubscription.rowKey = row.rowKey;
                rowSubscription.rowIndex = row.rowIndex;

                rowManager.rowSubscriptions[row.rowIndex] = rowSubscription;

                rowSubscription.subscription = ko.renderTemplate(grid.config.rowTemplate, newBindingCtx, null, divNode, 'replaceNode');
            });

            //only measure the row and cell differences when data changes
            if (grid.elementsNeedMeasuring && grid.initPhase > 0) {
                //Measure the cell and row differences after rendering
                kg.domUtility.measureRow($(element), grid);
            }

            return { 'controlsDescendantBindings': true };
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\kgRow.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgRow'] = (function () {
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var row = valueAccessor(),
                classes = 'kgRow',
                grid = bindingContext.$parent,
                rowManager = bindingContext.$parent.rowManager,
                rowSubscription;

            classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

            element['_kg_rowIndex_'] = row.rowIndex;
            element.style.top = row.offsetTop + 'px';
            element.className = classes;

            //ensure we know the node to dispose later!

            rowSubscription = rowManager.rowSubscriptions[row.rowIndex];
            if (rowSubscription) {
                rowSubscription.node = element;
            }
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\kgCell.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['kgCell'] = (function () {
    var makeValueAccessor = function (cell) {
        var func;

        if (cell.column.field === 'rowIndex') {
            return function () { return cell.row.rowDisplayIndex; }
        } else {
            return function () { return cell.data; }
        }
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = valueAccessor(),
                cell,
                row = bindingContext.$data;

            //get the cell from the options
            cell = row.cellMap[options.value];

            //ensure the cell has the right class so it lines up correctly
            element.className += " kgCell " + "col" + cell.column.index;

            if (cell.column.field !== '__kg_selected__' && !cell.column.hasCellTemplate) {
                ko.bindingHandlers.text.update(element, makeValueAccessor(cell));
            }
        }
    };

} ()); 
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\kgHeaderRow.js 
***********************************************/ 
﻿ko.bindingHandlers['kgHeaderRow'] = (function () {

    var buildHeaders = function (grid) {
        var cols = grid.columns(),
            cell,
            headerRow = new kg.HeaderRow();

        utils.forEach(cols, function (col, i) {
            cell = new kg.HeaderCell(col);
            cell.colIndex = i;

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

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            buildHeaders(grid);

            return ko.bindingHandlers.template.init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            return ko.bindingHandlers.template.update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, bindingContext);
        }
    }
} ()); 
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\kgHeaderCell.js 
***********************************************/ 
﻿ko.bindingHandlers['kgHeader'] = (function () {
    var makeNewValueAccessor = function (headerCell, grid) {
        return function () {
            return {
                name: headerCell.headerTemplate || grid.config.headerCellTemplate,
                data: headerCell
            };
        };
    };
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                cell,
                property,
                options = valueAccessor(); //string of the property name

            if (options) {
                property = options.value;
                cell = headerRow.headerCellMap[property];
                if (cell) {
                    if (property !== 'rowIndex' && property !== '__kg_selected__') {
                        return { 'controlsDescendantBindings': true }
                    }
                }
            }

            
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var headerRow = bindingContext.$data,
                grid = bindingContext.$parent,
                cell,
                property,
                options = valueAccessor(); //string of the property name

            if (options) {
                property = options.value;
                cell = headerRow.headerCellMap[property];
                if (cell) {
                    
                    //format the header cell
                    element.className += " kgHeaderCell col" + cell.colIndex;
                    
                    //add the custom class in case it has been provided
                    if (cell.headerClass) {
                        element.className += " " + cell.headerClass;
                    }

                    if (property !== 'rowIndex' && property !== '__kg_selected__') {
                        //render the cell template
                        return ko.bindingHandlers.template.update(element, makeNewValueAccessor(cell, grid), allBindingsAccessor, viewModel, bindingContext);
                    }
                }
            }
        }
    }
} ()); 
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\kgFooter.js 
***********************************************/ 
﻿ko.bindingHandlers['kgFooter'] = (function () {
    var makeNewValueAccessor = function (grid) {
        return function () {
            return { name: grid.config.footerTemplate, data: grid.footer };
        }
    };

    var makeNewBindingContext = function (bindingContext, footer) {
        return bindingContext.createChildContext(footer);
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            grid.footer = new kg.Footer(grid);

            return ko.bindingHandlers.template.init(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid.footer));
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = bindingContext.$data;

            return ko.bindingHandlers.template.update(element, makeNewValueAccessor(grid), allBindingsAccessor, grid, makeNewBindingContext(bindingContext, grid.footer));
        }
    }
} ()); 
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\kgSize.js 
***********************************************/ 
﻿ko.bindingHandlers['kgSize'] = (function () {

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $container = $(element),
                $parent = $container.parent(),
                dim = ko.utils.unwrapObservable(valueAccessor()),
                oldHt = $container.outerHeight(),
                oldWdth = $container.outerWidth();

            if (dim.autoFitHeight) {
                dim.outerHeight = $parent.height();
            }


            if (dim.innerHeight && dim.innerWidth) {
                $container.height(dim.innerHeight);
                $container.width(dim.innerWidth);
                return;
            };

            if (oldHt !== dim.outerHeight || oldWdth !== dim.outerWidth) {
                //now set it to the new dimension, remeasure, and set it to the newly calculated
                $container.height(dim.outerHeight).width(dim.outerWidth);

                //remeasure
                oldHt = $container.outerHeight();
                oldWdth = $container.outerWidth();

                dim.heightDiff = oldHt - $container.height();
                dim.widthDiff = oldWdth - $container.width();

                $container.height(dim.outerHeight - dim.heightDiff);
                $container.width(dim.outerWidth - dim.widthDiff);
            }
        }
    };
} ()); 
}(window)); 
