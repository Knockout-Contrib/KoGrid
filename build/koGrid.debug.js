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
    this.rowIndex = 0;
    this.offsetTop = 0;
    this.height = ko.observable(0);
}; 
 
 
/*********************************************** 
* FILE: ..\Src\GridClasses\RowCollection.js 
***********************************************/ 
﻿ 
 
 
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
        rowTemplate: null,
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

    viewportH, viewportW,
    minRowsToRender,
    maxRows = ko.computed(function(){
        var allData;
        if(self.data){
            allData = self.data();
        }
        return allData.length || 0;
    }),
    rowCache = {},

    viewableRange = ko.observable(),
    renderedRange = ko.computed(function () {
        var rg = viewableRange();

        rg.bottomRow = Math.max(0, rg.bottomRow - 10);
        rg.topRow = Math.min(maxRows(), rg.topRow + 10);

        return rg;
    });

    // set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = config.data;
    this.filteredData = ko.computed(function () {

        //TODO: build out filtering
        return self.data();
    });
    

    this.columns = new kg.ColumnCollection();
    this.rows = ko.computed(function () {
        var rg = renderedRange(),
            rowArr = [],
            dataArr = self.filteredData().slice(rg.bottomRow, rg.topRow);

        utils.forEach(dataArr, function (item, i) {
            rowArr.push(buildRowFromEntity(item, rg.bottomRow + i));
        });
        return rowArr;
    });

    var buildRowFromEntity = function (entity, rowIndex) {
        var row = rowCache[rowIndex];

        if (!row) {

            row = new kg.Row();
            row.rowIndex = rowIndex;
            row.height = config.rowHeight;
            row.offsetTop = row.height * rowIndex;
            row.entity(entity);

            buildCellsFromRow(row);
        }

        return row;
    };

    var buildCellsFromRow = function (row) {
        var cols = self.columns(),
            cell;

        utils.forEach(cols, function (col, i) {
            cell = new kg.Cell();
            cell.column = col;
            cell.row = row;
            cell.data(row.entity[col.field]);
            cell.width(col.width());
            cell.offsetLeft(col.offsetLeft());

            row.cells.push(cell);
        });
    };

    var buildDomStructure = function (rootDomNode) {
        $root = $(rootDomNode);
        $root.empty();

        $root.css("position", "relative");

        //Headers
        $headerContainer = $('<div class="kgHeaderContainer" style="position: relative;"></div>').appendTo($root);

        //Viewport
        $viewport = $('<div class="kgViewport" style="overflow: auto;"></div>').appendTo($root);

        //Canvas
        $canvas = $('<div class="kgCanvas" style="position: relative;"></div>').appendTo($viewport);

        //Footers
        $footerContainer = $('<div class="kgFooterContainer"></div>').appendTo($root);
    };

    var measureDomConstraints = function () {

        viewportH = $viewport.height();
        viewportW = $viewport.width();

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

        viewableRange(new Range(0, 20);
    };
}; 
 
 
/*********************************************** 
* FILE: ..\Src\BindingHandlers\koGridBindingHandler.js 
***********************************************/ 
﻿/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../../lib/jquery-1.7.js" />

ko.bindingHandlers['koGrid'] = (function () {

    return {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var grid = new kg.KoGrid(valueAccessor());

            grid.init(element);

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        }
    };

} ());
 
}(window)); 
