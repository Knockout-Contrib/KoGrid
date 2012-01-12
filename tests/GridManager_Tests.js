/// <reference path="qunit/qunit.js" />

module('GridManager Tests');

test('Grid Caching Works', function () {

    var el = document.createElement('DIV'),
        grid = { gridId: 'myTestId' };

    kg.gridManager.storeGrid(el, grid);

    ok(kg.gridManager.gridCache['myTestId'], 'Grid was stored in cache');
    ok(el['__koGrid__'], 'Grid was stored on element');

    kg.gridManager.clearGridCache();
});

test('Grid Retreival Works', function () {

    var el = document.createElement('DIV'),
        grid = { gridId: 'myTestId' },
        testGrid;

    kg.gridManager.storeGrid(el, grid);

    testGrid = kg.gridManager.getGrid(el);

    ok(kg.gridManager.gridCache['myTestId'], 'Grid was stored in cache');
    ok(testGrid, 'Grid was retrieved correctly');

    kg.gridManager.clearGridCache();
});