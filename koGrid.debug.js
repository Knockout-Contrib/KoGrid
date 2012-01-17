/*********************************************** 
* KoGrid JavaScript Library 
* (c) Eric M. Barnard 
* License: MIT (http://www.opensource.org/licenses/mit-license.php) 
* Compiled At: 15:20:23.38 Tue 01/17/2012 
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
                '<div class="kgCanvas" data-bind="kgRows: $data.rows" style="position: relative">' +
                '</div>' +
            '</div>' +
            '<div class="kgFooterPanel" data-bind="kgFooter: $data, kgSize: $data.footerDim">' +
                
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
            b.append('  <img class="kgFilterImg"  data-bind="click: $parent.showFilter_Click" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALdJREFUOE+lU9ERxSAIcyd3cid2ciceGPOUVnvt+UGV6yWBgElV00kcgV24ERSpWkSnYI4zlxoiZWn5RKBqHFotxD44e24Xv0s/KeYkfwJUAQDBAIFoVIeKUoZ6IJhJADLl1tZoA2AoLwnuJFSncgTfKiCrK7kXrQIza6W8rSCSwIfUHV/ty3YPfEz0giP7RIA24MHVuEcT+dNVfaRcot26b1uIFYy5X4kePXD1eW0/efD2hR6/xh98LfKQ4yD0/gAAAABJRU5ErkJggg=="/>');
            b.append('  <img class="kgClearFilter" data-bind="visible: $data.filterVisible, click: $parent.clearFilter_Click" style="display: none;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABVklEQVQ4T2NgGBQgbeaZ/2kz//8v63jy/xcL+/89ThFgPkzcOO3Mf7OUE/9PSZmAMYvRtP8gMbjjQYqBZvw/A8S729r+A2X+b56xD8yfCZQAyR2Kqvj/h5X9f03TWrDhDMYzEQaATAIJgjSA8H17//9fhcT/L+h7C9bcWHsRbOislDaoZiTbkcMQZsjibSCvsP6/Yp/1P2/Cgf9vBWX/b1H1wm4zeiTADNndtgJs6x0lq/8feYX+FwBdg+FsXDEICZMz/x9qe4INmZi7nXjNMENBMQIKNJABU7VCUAOMUNoBqmYBRddncdn/c5KawYYAsS8hfXB5oOIUkKZ1C0+BA26RkDnIgB9ALETQEKAiNZDmNpsKcJSCEoxj3F6YAYvwGgByOhA/AuK9GdN+g9MAJNEAGUAvQL0SjtMQoIIJUKeqgWwGJ1dgioMlW6DcIqi8NEGv0E0BAJoSBFFFVzBnAAAAAElFTkSuQmCC" />');
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

    b.append('<div data-bind="click: $data.sort">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortAscVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAERJREFUeNpi/P//PwMySE9PBwvMnDmTEVmcCZsidDaKQnQJdDEmXIrQFTMhK0J2FzIbpIYJmwQ2MUayfI0PDKBCgAADALw1Jt+DRlRcAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortDescVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrEkDEOACAIA6Hxr7yJ12JwahCNmzeWklI0IoQxsyW4u7IOeeSjcZyOr+VQhc6UaL6nMzGZhlssz1CFzrS15kFdnAIMAII6I3XoVkIHAAAAAElFTkSuQmCC"/>');
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
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgCell: { value: \'{0}\' } ">', col.field);
            b.append('  <input type="checkbox" data-bind="checked: $data.selected" />');
            b.append('</div>');
        } else if (col.field === 'rowIndex') {
            b.append('<div class="kgRowIndexCell" data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        } else {
            b.append('  <div data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        }
    });

    b.append('</div>');

    return b.toString();
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\FooterTemplate.js 
***********************************************/ 
﻿kg.templates.defaultFooterTemplate = function () {
    return  '<div>' +
                '<strong>Total Items:</strong><span data-bind="text: maxRows"></span>&nbsp' +
                '<strong>Selected Items:</strong><span data-bind="text: selectedItemCount"></span>&nbsp&nbsp' +
                '<div data-bind="visible: pagerVisible">' +
                    'Page Size: <select data-bind="options: pageSizes, value: selectedPageSize"></select>' +
                    '<button data-bind="click: pageBackward"> << </button>' +
                    'Page: <span data-bind="text: currentPage"></span> of <span data-bind="text: maxPages"></span>' +
                    '<button data-bind="click: pageForward"> >> </button>' +
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

        'innerText' in tmpl ? tmpl.innerText = templateText
                            : tmpl.textContent = templateText;

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
    this.width = ko.computed(function () {
        return col.width();
    });
//    this.offsetLeft = ko.computed(function () {
//        return col.offsetLeft();
//    });
//    this.offsetRight = ko.computed(function(){
//        return col.offsetRight();
//    });
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

    //sorting
    this.allowSort = true;
    this.sortDirection = ko.observable("");

    //filtering
    this.filter = ko.observable();
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
﻿kg.Row = function (entity) {
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
        }else {
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
    this.height = ko.observable(0);
    this.width = ko.observable(0);

    this.onSelectionChanged = function () { }; //replaced in rowManager

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

            if (!isDif && prevMinRows !== minRows) {
                isDif = true;
            }

            if (isDif) {
                rg.topRow = rg.bottomRow + minRows; //make sure we have the correct number of rows rendered

                rg.bottomRow = Math.max(0, rg.bottomRow - self.excessRows);
                rg.topRow = Math.min(maxRows, rg.topRow + self.excessRows);

                prevMaxRows = maxRows;
                prevMinRows = minRows;
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
                var ent = this.entity();

                grid.changeSelectedItem(ent);    
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
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Footer.js 
***********************************************/ 
﻿kg.Footer = function (grid) {
    var self = this;

    this.maxRows = grid.maxRows; //observable
    this.selectedItemCount = grid.selectedItemCount; //observable

    this.pagerVisible = ko.observable(grid.config.enablePaging);
    this.selectedPageSize = ko.observable(grid.config.defaultPageSize);
    this.pageSizes = ko.observableArray(grid.config.pageSizes);
    this.currentPage = ko.observable(1);
    this.maxPages = ko.computed(function () {
        var maxCnt = self.maxRows(),
            pageSize = self.selectedPageSize();
        return Math.ceil(maxCnt / pageSize);
    });

    this.pageForward = function () {
        var page = self.currentPage();
        self.currentPage(Math.min(page + 1, self.maxPages()));

        if(page !== self.currentPage()){
            grid.pageChanged(page);
        }
    }

    this.pageBackward = function () {
        var page = self.currentPage();
        self.currentPage(Math.max(page - 1, 1));

        if(page !== self.currentPage()){
            grid.pageChanged(page);
        }
    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\FilterManager.js 
***********************************************/ 
﻿kg.FilterManager = function (options) {
    var self = this;

    //map of column.field values to filterStrings
    this.filterInfo = ko.observable();
    this.data = options.data; //observableArray

    this.filteredData = ko.computed(function () {
        var filterInfo = self.filterInfo(),
            data = self.data(),
            keepRow = false,
            match = true,
            field,
            itemData,
            itemDataStr,
            filterStr;

        if (!filterInfo || $.isEmptyObject(filterInfo)) {
            return data;
        }

        return ko.utils.arrayFilter(data, function (item) {

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

    });

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
        footerRowHeight: 45,
        filterRowHeight: 30,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        headerCellTemplate: 'kgHeaderCellTemplate',
        footerTemplate: 'kgFooterTemplate',
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: [],
        pageSizes: [250, 500, 1000], //page Sizes
        enablePaging: false,
        defaultPageSize: 250, //Size of Paging data
        totalServerItems: null, //ko.observable of how many items are on the server (for paging)
        selectedItem: ko.observable(), //ko.observable
        selectedItems: ko.observableArray([]), //ko.observableArray
        isMultiSelect: true, //toggles between selectedItem & selectedItems
        displaySelectionCheckbox: true, //toggles whether row selection check boxes appear
        displayRowIndex: true, //shows the rowIndex cell at the far left of each row
        allowFiltering: true,
        minRowsToRender: ko.observable(1),
        maxRowWidth: ko.observable(120),
        pageChanged: function () { }
    },

    self = this,
    filterIsOpen = ko.observable(false),
    filterManager,
    isSorting = false,
    prevScrollTop, prevScrollLeft;

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

    this.filterInfo = filterManager.filterInfo; //observable
    this.filteredData = filterManager.filteredData;

    var maxCanvasHt;
    this.maxRows = ko.computed(function () {
        var rows = self.filteredData();
        maxCanvasHt = rows.length * self.config.rowHeight;
        return rows.length || 0;
    });

    this.maxCanvasHeight = function () {
        return maxCanvasHt;
    };

    this.selectedItemCount = ko.computed(function () {
        var single = self.config.selectedItem(),
            arr = self.config.selectedItems();

        if (!self.config.isMultiSelect) {
            return (single !== null && single !== undefined) ? 1 : 0; //truthy statement
        } else {
            return arr.length;
        }
    });


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
        rootMaxH: 0
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
            newDim = new kg.Dimension();

        newDim.outerHeight = self.config.footerRowHeight;
        newDim.outerWidth = rootDim.outerWidth;

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

    var prevMinRowsToRender;
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
            newDim = new kg.Dimension();

        newDim.autoFitHeight = true;
        newDim.outerWidth = self.totalRowWidth();

        if (vScrollBarIsOpen) { newDim.outerWidth += self.elementDims.scrollW; }

        return newDim;
    });

    //#endregion

    //#region Events

    this.config.selectedItem.subscribe(function (currentEntity) {
        //ensure outgoing entity is de-selected
        if (!self.config.isMultiSelect) {

            //uncheck the current entity
            if (currentEntity && currentEntity['__kg_selected__']) {
                currentEntity['__kg_selected__'](false);
            }
        }

    }, self, "beforeChange");

    this.config.selectedItem.subscribe(function (entity) {
        //ensure the current entity is checked
        if (entity && entity['__kg_selected__']) {
            entity['__kg_selected__'](true);
        }
    });

    this.changeSelectedItem = function (changedEntity) {
        var currentEntity = self.config.selectedItem(),
            currentItems = self.config.selectedItems,
            keep = false;

        if (!self.config.isMultiSelect) {
            //Single Select Logic

            //find out if the changed entity is selected or not
            if (changedEntity && changedEntity['__kg_selected__']) {
                keep = changedEntity['__kg_selected__']();
            }

            if (keep) {
                //set the new entity
                self.config.selectedItem(changedEntity);
            } else {
                //else just set it to null if there are no selected items
                self.config.selectedItem(null);
            }

        } else {
            //Multi-Select Logic

            //if the changed entity was de-selected, remove it from the array
            if (changedEntity && changedEntity['__kg_selected__']) {
                keep = changedEntity.__kg_selected__();
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

    this.pageChanged = ko.observable(1); //event for paging
    this.pageChanged.subscribe(self.config.pageChanged);

    this.sortData = function (col, dir) {
        isSorting = true;

        utils.forEach(self.columns(), function (column) {
            if (column.field !== col.field) {
                if (column.sortDirection() !== "") { column.sortDirection(""); }
            }
        });

        self.data.sort(function (a, b) {
            var propA = ko.utils.unwrapObservable(a[col.field]),
                propB = ko.utils.unwrapObservable(b[col.field]);

            if (!propA && !propB) {
                return 0;
            }

            if (typeof propA === "string") {
                propA = propA.toUpperCase();
            } else {
                propA = propA.toString().toUpperCase();
            }

            if (typeof propB === "string") {
                propB = propB.toUpperCase();
            } else {
                propB = propB.toString().toUpperCase();
            }

            if (dir === "asc") {
                return propA == propB ? 0 : (propA < propB ? -1 : 1);
            } else {
                return propA == propB ? 0 : (propA > propB ? -1 : 1);
            }
        });

        isSorting = false;
    };

    //#endregion

    //#region Rendering


    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!self.config.isMultiSelect) {
                return cnt === 1;
            }
            return cnt === self.maxRows();
        },
        write: function (val) {
            var checkAll = val,
                selectedItemsToPush = [],
                data,
                firstItem;

            if (self.config.isMultiSelect) {
                data = self.filteredData();
                firstItem = data[0];

                ko.utils.arrayForEach(data, function (entity) {
                    if (!entity['__kg_selected__']) { entity['__kg_selected__'] = ko.observable(checkAll); }
                    else {
                        //ko will suppress this if it was already selected                    
                        entity['__kg_selected__'](checkAll);
                    }

                    if (checkAll) {
                        selectedItemsToPush.push(entity);
                    }
                });

                self.config.selectedItems(selectedItemsToPush);

            } else {
                if (!checkAll) {
                    self.config.selectedItem(null);
                }
            }
        }
    });

    this.refreshDomSizes = function () {
        var dim = new kg.Dimension(),
            oldDim = self.rootDim(),
            rootH = 0,
            rootW = 0,
            canvasH = 0;

        //calculate the POSSIBLE biggest viewport height
        rootH = self.maxCanvasHeight() + self.config.headerRowHeight + self.config.footerRowHeight;

        //see which viewport heigth will be allowed to be used
        rootH = Math.min(self.elementDims.rootMaxH, rootH);

        //now calc the canvas height of what is going to be used in rendering
        canvasH = rootH - self.config.headerRowHeight - self.config.footerRowHeight;

        //get the max row Width for rendering
        rootW = self.totalRowWidth() + self.elementDims.rowWdiff;

        //now see if we are going to have a vertical scroll bar present
        if (self.maxCanvasHeight() > canvasH) {

            //if we are, then add that width to the max width 
            rootW += self.elementDims.scrollW;
        }

        //now see if we are constrained by any width dimensions
        dim.outerWidth = Math.min(self.elementDims.rootMaxW, rootW);
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

        //self.elementsNeedMeasuring = true;

        if (self.initPhase > 0) {

            //don't shrink the grid if we sorting or filtering
            if (!filterIsOpen() && !isSorting) {

                self.refreshDomSizes();

                kg.cssBuilder.buildStyles(self);

                if (self.$root) {
                    self.$root.show(); //unhide the grid after the rendering has finished
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

                column.width(colDef.width || self.config.columnWidth);

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

        self.initPhase = 1;
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

    this.adjustScrollTop = function (scrollTop) {
        var rowIndex;

        if (prevScrollTop === scrollTop) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.config.minRowsToRender()));
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
* FILE: ..\Src\DomManipulation\DomFormatter.js 
***********************************************/ 
﻿kg.domFormatter = {

    formatHeaderRow: function (element, headerRow) {

    },

    formatHeaderCell: function (element, headerCell) {

        element.className += " kgHeaderCell col" + headerCell.colIndex;
    },

    formatRow: function (element, row) {
        var classes = 'kgRow';
        classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

        element['_kg_rowIndex_'] = row.rowIndex;
        element.style.top = row.offsetTop + 'px';
        element.className = classes;
    },

    formatCell: function (element, cell) {

        element.className += " kgCell " + "col" + cell.column.index;

    },

    formatFooter: function (element, footer) {

    }
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

        css.append(".{0} .kgCell { height: {1}px; }", gridId, rowHeight);
        css.append(".{0} .kgRow { position: absolute; width: {1}px; height: {2}px; line-height: {2}px; display: inline; }",gridId, grid.totalRowWidth(), rowHeight);
        css.append(".{0} .kgHeaderCell { height: {1}px; }", gridId, rowHeight);
        css.append(".{0} .kgHeaderScroller { line-height: {1}px; }", gridId, rowHeight);
        

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

        $container.append("<div style='height: 20000px; width: 20000px;'></div>");

        dims.maxWidth = $container.width();
        dims.maxHeight = $container.height();

        return dims;
    };

    this.scrollH;
    this.scrollW;

    $(function () {
        $testContainer.appendTo('body');
        // 1. Run all the following measurements on startup!

        //measure Scroll Bars
        $testContainer.height(100).width(100).css("position", "absolute").css("overflow", "scroll");
        $testContainer.append('<div style="height: 400px; width: 400px;"></div>');
        self.scrollH = ($testContainer.height() - $testContainer[0].clientHeight);
        self.scrollW = ($testContainer.width() - $testContainer[0].clientWidth);
        $testContainer.empty();


        $testContainer.remove();
    });

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

    var measureElementMaxSizes = function ($container, grid) {
        var dims = kg.domUtility.measureElementMaxDims($container);

        grid.elementDims.rootMaxW = dims.maxWidth;
        grid.elementDims.rootMaxH = dims.maxWidth;

        grid.elementDims.scrollW = kg.domUtility.scrollW;
        grid.elementDims.scrollH = kg.domUtility.scrollH;
    };

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid,
                options = valueAccessor(),
                $element = $(element);

            $element.hide(); //first hide the grid so that its not freaking the screen out!

            //create the Grid
            grid = new kg.KoGrid(options);

            kg.gridManager.storeGrid(element, grid);

            //get the max container sizes
            measureElementMaxSizes($element, grid);

            //set the right styling on the container
            $(element).addClass("kgGrid")
                      .addClass(grid.gridId.toString())
                      .css("position", "relative");

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
                rows = ko.utils.unwrapObservable(valueAccessor()),
                grid = bindingContext.$data,
                $row,
                $cell,
                newAccessor,
                retVal;

            element.style.height = (bindingContext.$data.maxCanvasHeight()) + 'px';

            newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            retVal = ko.bindingHandlers.template.update(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);

            //only measure the row and cell differences once
            if (grid.elementsNeedMeasuring && grid.initPhase > 0) {
                //Measure the cell and row differences after rendering
                $row = $(element).children().first();
                if ($row) {
                    $cell = $row.children().first();
                    if ($cell) {

                        grid.elementDims.rowWdiff = $row.outerWidth() - $row.width();
                        grid.elementDims.rowHdiff = $row.outerHeight() - $row.height();

                        grid.elementDims.cellWdiff = $cell.outerWidth() - $cell.width();
                        grid.elementDims.cellHdiff = $cell.outerHeight() - $cell.height();

                        //grid.elementsNeedMeasuring = false;
                    }
                }
            }
            return retVal;
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
                grid = bindingContext.$parent,
                rowManager = bindingContext.$parent.rowManager;

            kg.domFormatter.formatRow(element, row);
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
            return function () { return cell.row.rowIndex; }
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

            kg.domFormatter.formatCell(element, cell);

            if (cell.column.field !== '__kg_selected__') {
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

            kg.domFormatter.formatHeaderRow(element, grid.headerRow);

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
                name: grid.config.headerCellTemplate,
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
                    kg.domFormatter.formatHeaderCell(element, cell);


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

            kg.domFormatter.formatFooter(element, grid.footer);

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
                $parent = $container.parent();
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
 
 
/*********************************************** 
* FILE: ..\src\BindingHandlers\hasfocusEOL.js 
***********************************************/ 
﻿ko.bindingHandlers['hasfocusEOL'] = {

    init: function (element, valueAccessor, allBindingsAccessor) {
        ko.bindingHandlers['hasfocus'].init(element, valueAccessor, allBindingsAccessor);
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var val = element.value,
            isFocus = ko.utils.unwrapObservable(valueAccessor());

        if (isFocus) {
            element.value = '';
            ko.bindingHandlers['hasfocus'].update(element, valueAccessor, allBindingsAccessor);
            element.value = val;
        }
    }
}; 
}(window)); 
