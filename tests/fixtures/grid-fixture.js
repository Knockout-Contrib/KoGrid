'use strict';

function GridFixture() {

    var data = ko.observableArray([
        { prop1: 'test1', prop2: 'test2'},
        { prop1: 'test3', prop2: 'test4'}
    ]);

    this.columnDefs = [
        {
            field: 'prop1',
            displayName: 'Property One',
            cellFilter: function () {
                return undefined;
            }
        },
        {
            field: 'prop2',
            displayName: 'Property Two'
        }
    ];

    this.grid = function (options) {

        var defaults = { data: data, columnDefs: this.columnDefs };

        var grid = new window.kg.Grid($.extend(defaults, options));

        window.kg.domUtilityService.AssignGridContainers("<div><div class='kgViewport'></div></div>", grid);

        return grid;
    };

    this.selectionService = null;

    this.getSelectionService = function (grid) {
        if (!this.selectionService) {
            this.selectionService = new window.kg.SelectionService(grid);

            var rowFactory = new window.kg.RowFactory(grid);

            this.selectionService.Initialize(rowFactory);
        }
        return this.selectionService;
    };

    this.row = function (rowIndex, grid) {

        var entity = grid.filteredData()[rowIndex];
        var selectionService = this.getSelectionService(grid);

        return selectionService.rowFactory.buildEntityRow(entity, rowIndex);
    };
}

var mock = (function () {
    var gridFixture = new GridFixture();

    return {
        gridFixture: gridFixture
    }

})();