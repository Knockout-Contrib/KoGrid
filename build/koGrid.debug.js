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

utils.StringBuilder = function () {
    var strArr = [];

    this.append = function (str, data) {
        var len = arguments.length,
            strMatch = '{0}',
            i = 1;

        if (len > 1) { // they provided data
            while (i <= len) {
                str = str.replace(strMatch, arguments[i]);
                i++;
                strMatch = "{" + i - 1 + "}";
            }
        }
        strArr.push(str);
    };

    this.toString = function () {
        return strArr.join("");
    };
};

kg.utils = utils; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\GridTemplate.js 
***********************************************/ 
﻿kg.defaultGridInnerTemplate = function () {
    return  '<div class="kgTopPanel">' +
                '<div class="kgHeaderContainer" style="position: relative; overflow-x: hidden">' +
                    '<div class="kgHeaderScroller" data-bind="kgHeaderRow: $data">' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="kgViewport" style="overflow: auto;">' +
                '<div class="kgCanvas" data-bind="kgRows: $data.rows" style="position: relative">' +
                '</div>' +
            '</div>' +
            '<div class="kgFooterPanel" data-bind="kgFooter: $data">' +
                
            '</div>';
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\HeaderTemplate.js 
***********************************************/ 
﻿kg.defaultHeaderTemplate = function () {
    return '<div data-bind="kgHeader: { value: \'__kg_selected__\' } ">' +
                '<input type="checkbox" data-bind="checked: $parent.toggleSelectAll" />' + 
           '</div>' +
           '<div data-bind="kgHeader: { value: \'Sku\' } "></div>' +
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

kg.generateRowTemplate = function (cols) {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="kgRow: $data">');

    utils.forEach(cols, function (col, i) {
        b.append('  <div data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
    });
    b.append('</div>');

    return b.toString();
}; 
 
 
/*********************************************** 
* FILE: ..\Src\Templates\FooterTemplate.js 
***********************************************/ 
﻿kg.defaultFooterTemplate = function () {
    return  '<div>' +
                '<strong>Total Items:</strong><span data-bind="text: maxRows"></span>&nbsp' +
                '<strong>Selected Items:</strong><span data-bind="text: selectedItemCount"></span>&nbsp&nbsp' +
                '<strong>Selected Page Size:</strong><span data-bind="text: selectedPageSize"></span>' +
                '<select data-bind="options: pageSizes, value: selectedPageSize"></select>' +
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
    this.displayName = colDef.displayName || '';
    this.colIndex = 0;
    this.isVisible = ko.observable(false);
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

            row = new kg.Row(entity);
            row.rowIndex = rowIndex + 1; //not a zero-based rowIndex
            row.height = ko.computed(function () {
                return grid.config.rowHeight;
            });
            row.offsetTop = self.rowHeight * rowIndex;

            row.width = ko.computed(function () {
                return grid.config.maxRowWidth();
            });

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
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\Footer.js 
***********************************************/ 
﻿kg.Footer = function (grid) {
    this.maxRows = grid.maxRows; //observable
    this.selectedPageSize = ko.observable(250);
    this.pageSizes = ko.observableArray([250, 500, 1000]);
    this.selectedItemCount = grid.selectedItemCount; //observable
}; 
 
 
/*********************************************** 
* FILE: ..\Src\KoGrid.js 
***********************************************/ 
﻿/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />

kg.KoGrid = function (options) {
    var defaults = {
        rowHeight: 30,
        columnWidth: 100,
        headerRowHeight: 30,
        footerRowHeight: 30,
        rowTemplate: 'kgRowTemplate',
        headerTemplate: 'kgHeaderRowTemplate',
        footerTemplate: 'kgFooterTemplate',
        gridCssClass: 'koGrid',
        autogenerateColumns: true,
        data: null, //ko.observableArray
        columnDefs: [],
        pageSizes: [250, 500, 1000], //page Sizes
        defaultPageSize: 250, //Size of Paging data
        totalServerItems: null, //ko.observable of how many items are on the server (for paging)
        selectedItem: ko.observable(), //ko.observable
        selectedItems: ko.observableArray([]), //ko.observableArray
        isMultiSelect: true, //toggles between selectedItem & selectedItems
        allowRowSelection: true, //toggles whether row selection check boxes appear
        displayRowIndex: true, //shows the rowIndex cell at the far left of each row
        minRowsToRender: ko.observable(1),
        maxRowWidth: ko.observable(120)
    },

    self = this,
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

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;
    this.filteredData = ko.computed(function () {

        //TODO: build out filtering
        return self.data();
    });
    this.maxRows = ko.computed(function () {
        var rows = self.filteredData();
        return rows.length || 0;
    });

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
        viewportH: 0,
        viewportW: 0,
        scrollW: 0,
        scrollH: 0,
        cellHdiff: 0,
        cellWdiff: 0,
        rowWdiff: 0,
        rowHdiff: 0,
        headerWdiff: 0,
        headerHdiff: 0,
        headerCellWdiff: 0,
        headerCellHdiff: 0,
        footerWdiff: 0,
        footerHdiff: 0,
        rowIndexCellW: 25,
        rowSelectedCellW: 25
    };

    //#region Events
    this.selectedItemChanged = ko.observable(); //gets notified everytime a row is selected
    this.selectedItemChanged.subscribe(function (entity) {
        var isSelected = entity['__kg_selected__'](),
            selectedItem = self.config.selectedItem(),
            selectedItems = self.config.selectedItems;

        if (isSelected) {
            if (self.config.isMultiSelect) {
                selectedItems.push(entity);
            } else {
                if (selectedItem) { selectedItem['__kg_selected__'](false); }
                self.config.selectedItem(entity);
            }
        } else {
            if (self.config.isMultiSelect) {
                selectedItems.remove(entity);
            } else {
                if (selectedItem === entity) {
                    self.config.selectedItem(null);
                }
            }
        }
    });
    //#endregion

    //#region Rendering

    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!self.config.isMultiSelect) { return cnt === 1; }
            return cnt === self.maxRows();
        },
        write: function (val) {
            var checkAll = val;

            if (self.config.isMultiSelect) {
                ko.utils.arrayForEach(self.filteredData(), function (entity) {
                    if (!entity['__kg_selected__']) { entity['__kg_selected__'] = ko.observable(checkAll); }
                    else {
                        entity['__kg_selected__'](checkAll);
                    }
                    if (checkAll) {
                        self.config.selectedItems.push(entity);
                    } else {
                        self.config.selectedItems.remove(entity);
                    }
                });
            } else {
                if (!checkAll) {
                    self.config.selectedItem(null);
                }
            }
        }
    });

    this.update = function (rootDomNode) {
        //build back the DOM variables
        updateDomStructure(rootDomNode);

        measureDomConstraints();

        calculateConstraints();

        kg.cssBuilder.buildStyles(self);

        self.rowManager.viewableRange(new kg.Range(0, self.config.minRowsToRender()));
    };

    var updateDomStructure = function (rootDomNode) {

        self.$root = $(rootDomNode);

        // the 'with' binding blows away everything except the inner html, so rebuild it

        //Headers
        self.$topPanel = $(".kgTopPanel", self.$root[0]);
        self.$headerContainer = $(".kgHeaderContainer", self.$topPanel[0]);
        self.$headerScroller = $(".kgHeaderScroller", self.$headerContainer[0]);
        self.$headers = self.$headerContainer.children();

        //Viewport
        self.$viewport = $(".kgViewport", self.$root[0]);

        //Canvas
        self.$canvas = $(".kgCanvas", self.$viewport[0]);

        //Footers
        self.$footerPanel = $(".kgFooterPanel", self.$root[0]);
    };

    var measureDomConstraints = function () {
        var ruler = kg.domRuler;

        //pop the canvas, so we can measure the attributes
        self.$viewport.height(200).width(200);

        self.$canvas.height(100000); //pretty large, so the scroll bars, etc.. should open up
        self.$canvas.width(100000);


        //scrollBars
        $.extend(self.elementDims, ruler.measureScrollBar(self.$viewport));

        //rows
        $.extend(self.elementDims, ruler.measureRow(self.$canvas));

        //cells
        $.extend(self.elementDims, ruler.measureCell(self.$canvas));

        //header
        $.extend(self.elementDims, ruler.measureHeader(self.$headerScroller));

        //footer
        $.extend(self.elementDims, ruler.measureFooter(self.$footerPanel));

        self.elementDims.viewportH = self.$root.height() - self.config.headerRowHeight - self.elementDims.headerHdiff - self.config.footerRowHeight;
        self.elementDims.viewportW = self.$root.width();

        self.$viewport.height(self.elementDims.viewportH);
        self.$viewport.width(self.elementDims.viewportW);

        self.$canvas.width(self.config.maxRowWidth() + self.elementDims.rowWdiff);

        self.$headerContainer.height(self.config.headerRowHeight - self.elementDims.headerHdiff);
        self.$headerContainer.css("line-height", (self.config.headerRowHeight - self.elementDims.headerHdiff) + 'px');
        self.$headerContainer.width(self.elementDims.viewportW);

        self.$headerScroller.width(self.config.maxRowWidth() + self.elementDims.rowWdiff + self.elementDims.scrollW);
        self.$headerScroller.height(self.config.headerRowHeight - self.elementDims.headerHdiff);

        self.$footerPanel.width(self.elementDims.viewportW);
        self.$footerPanel.height(self.config.footerRowHeight - self.elementDims.footerHdiff);
    };

    var calculateConstraints = function () {

        //figure out how many rows to render in the viewport based upon the viewable height
        self.config.minRowsToRender(Math.floor(self.elementDims.viewportH / self.config.rowHeight));

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

        if (self.config.allowRowSelection) {
            columnDefs.splice(0, 0, { field: '__kg_selected__', width: self.elementDims.rowSelectedCellW });
        }
        if (self.config.displayRowIndex) {
            columnDefs.splice(0, 0, { field: 'rowIndex', width: self.elementDims.rowIndexCellW });
        }

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

                column.offsetLeft(rowWidth);
                column.width(colDef.width || self.config.columnWidth);

                rowWidth += column.width(); //sum this up

                //setup the max col width observable
                column.offsetRight = createOffsetRightClosure(column, self.config.maxRowWidth)();

                self.columns.push(column);
            });

            self.config.maxRowWidth(rowWidth);
        }

        self.config.rowTemplate = self.gridId + self.config.rowTemplate; //make it unique by id
        
    };

    this.init = function () {

        buildColumns();

        ensureTemplates();

        self.rowManager = new kg.RowManager(self);

        self.rows = self.rowManager.rows; // dependent observable
    };

    this.registerEvents = function () {
        self.$viewport.scroll(handleScroll);
    };

    var handleScroll = function (e) {
        var scrollTop = e.target.scrollTop,
            scrollLeft = e.target.scrollLeft,
            rowIndex;

        self.$headerContainer.scrollLeft(scrollLeft);

        if (prevScrollTop === scrollTop) { return; }

        rowIndex = Math.floor(scrollTop / self.config.rowHeight);

        prevScrollTop = scrollTop;

        self.rowManager.viewableRange(new kg.Range(rowIndex, rowIndex + self.config.minRowsToRender()));

    };

    var ensureTemplates = function () {
        var appendToFooter = function (el) {
            document.body.appendChild(el);
        };

        //Row Template
        if (!document.getElementById(self.config.rowTemplate)) {
            var tmpl = document.createElement("SCRIPT");
            tmpl.type = "text/html";
            tmpl.id = self.config.rowTemplate;
            tmpl.innerText = kg.generateRowTemplate(self.columns());
            appendToFooter(tmpl);
        }

        //Header Template
        if (!document.getElementById(self.config.headerTemplate)) {
            var tmpl = document.createElement("SCRIPT");
            tmpl.type = "text/html";
            tmpl.id = self.config.headerTemplate;
            tmpl.innerText = kg.defaultHeaderTemplate();
            appendToFooter(tmpl);
        }

        //Footer Template
        if (!document.getElementById(self.config.footerTemplate)) {
            var tmpl = document.createElement("SCRIPT");
            tmpl.type = "text/html";
            tmpl.id = self.config.footerTemplate;
            tmpl.innerText = kg.defaultFooterTemplate();
            appendToFooter(tmpl);
        }
    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\DomManipulation\DomFormatter.js 
***********************************************/ 
﻿kg.domFormatter = {
    formatGrid: function (element, grid) {

        $(element).addClass("kgGrid").addClass(grid.gridId.toString());

        element.style.position = "relative";
    },

    formatHeaderRow: function (element, headerRow) {

    },

    formatHeaderCell: function (element, headerCell) {

        element.className = "kgHeaderCell col" + headerCell.colIndex;
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
        var $style = grid.$style;

        if (!$style) {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($('head'));
        }

        var rowHeight = (grid.config.rowHeight - grid.elementDims.rowHdiff),
            gridId = grid.gridId,
            rules,
            i = 0,
            len = grid.columns().length,
            col,
            colWidth;
        
        rules = [
            "." + gridId + " .kgCell { height:" + rowHeight + "px }",

            "." + gridId + " .kgRow { position: absolute; width:" + grid.config.maxRowWidth() + "px; height:" + rowHeight + "px; line-height:" + rowHeight + "px; }",

            "." + gridId + " .kgSelectionCell { width:" + grid.elementDims.rowSelectedCellW + "px;}",

            "." + gridId + " .kgRowIndexCell { width:" + grid.elementDims.rowIndexCellW + "px; }"
        ];

        for (; i < len; i++) {
            col = grid.columns()[i];
            colWidth = col.width() - grid.elementDims.cellWdiff;
            rules.push("." + gridId + " .col" + i + " { left: " + col.offsetLeft() + "px; right: " + col.offsetRight() + "px; width: " + colWidth + "px; }");
        }

        if ($style[0].styleSheet) { // IE
            $style[0].styleSheet.cssText = rules.join(" ");
        }
        else {
            $style[0].appendChild(document.createTextNode(rules.join(" ")));
        }

        grid.$styleSheet = $style;
    }
}; 
 
 
/*********************************************** 
* FILE: ..\Src\DomManipulation\DomRuler.js 
***********************************************/ 
﻿kg.domRuler = (function () {

    return {
        measureRow: function ($container) {
            var diffs = {};

            var $dummyRow = $('<div></div>').addClass("kgRow").appendTo($container);

            diffs.rowHdiff = $dummyRow.outerHeight() - $dummyRow.height();
            diffs.rowWdiff = $dummyRow.outerWidth() - $dummyRow.width();

            $dummyRow.remove();
            return diffs;
        },

        measureCell: function ($container) {
            var diffs = {};

            var $dummyRow = $('<div></div>').addClass("kgRow").appendTo($container);
            var $dummyCell = $('<div></div>').addClass("kgCell").appendTo($dummyRow);

            diffs.cellHdiff = $dummyCell.outerHeight() - $dummyCell.height();
            diffs.cellWdiff = $dummyCell.outerWidth() - $dummyCell.width();

            $dummyRow.remove();
            return diffs;
        },

        measureScrollBar: function ($container) {
            var dim = {};

            dim.scrollH = Math.ceil($container.height() - parseFloat($container[0].clientHeight));
            dim.scrollW = Math.ceil($container.width() - parseFloat($container[0].clientWidth));

            return dim;
        },

        measureHeader: function ($container) {
            var diffs = {};

            var $dummyCell = $('<div></div>').addClass("kgHeaderCell").appendTo($container);

            diffs.headerCellHdiff = $dummyCell.outerHeight() - $dummyCell.height();
            diffs.headerCellWdiff = $dummyCell.outerWidth() - $dummyCell.width();

            diffs.headerHdiff = $container.outerHeight() - $container.height();
            diffs.headerWdiff = $container.outerWidth() - $container.width();

            $dummyCell.remove();
            return diffs;
        },

        measureFooter: function ($container) {
            var diffs = {};

            diffs.footerHdiff = $container.outerHeight() - $container.height();
            diffs.footerWdiff = $container.outerWidth() - $container.width();

            return diffs;

        }
    };
} ()); 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGrid.js 
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
                rows = ko.utils.unwrapObservable(valueAccessor());

            element.style.height = (bindingContext.$data.maxRows() * rowManager.rowHeight) + 'px';

            var newAccessor = makeNewValueAccessor(rows, rowManager.rowTemplateId);

            return ko.bindingHandlers.template.update(element, newAccessor, allBindingsAccessor, viewModel, bindingContext);
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
                rowManager = bindingContext.$parent.rowManager,
                selectionCell,
                displayIndex = grid.config.displayRowIndex ? 1 : 0,
                checkBox,
                indexCell;

            kg.domFormatter.formatRow(element, row);

            //allowRowSelection: true, 
            //displayRowIndex: true,
            if (grid.config.allowRowSelection) {
                selectionCell = document.createElement("DIV");
                selectionCell.innerHTML = "<input type='checkbox' data-bind='checked: $data.selected'/>";
                selectionCell.className = "kgSelectionCell";

                kg.domFormatter.formatCell(selectionCell, { column: { index: displayIndex} });
                element.insertBefore(selectionCell, element.children[0]);

                displayIndex--;
            }
            if (grid.config.displayRowIndex) {
                indexCell = document.createElement("DIV");
                indexCell.className = "kgRowIndexCell";

                kg.domFormatter.formatCell(indexCell, { column: { index: displayIndex} });

                element.insertBefore(indexCell, element.children[0]);
                ko.bindingHandlers.text.update(indexCell, function () { return row.rowIndex; });
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

//    var makeNewBindingContext = function (bindingContext, headerRow) {
//        return bindingContext.createChildContext(headerRow);
//    };

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
    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

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
                kg.domFormatter.formatHeaderCell(element, cell);

                //don't set text binding on elements that have templated content defined
                if (!element.children.length > 0) {
                    ko.bindingHandlers['text'].update(element, function () { return cell.displayName; });
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
}(window)); 
