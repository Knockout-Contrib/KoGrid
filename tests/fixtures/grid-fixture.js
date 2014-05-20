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
    }
}

var mock = (function () {
    var gridFixture = new GridFixture();

    return {
        gridFixture: gridFixture
    }

})();