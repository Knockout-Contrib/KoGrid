(function() {
    'use strict';
    /*global QUnit,kg*/

    QUnit.module('GridManager Tests');

    QUnit.test('Grid Caching Works', function(assert) {

        var el = document.createElement('DIV'),
            grid = { gridId: 'myTestId' };

        kg.gridManager.storeGrid(el, grid);

        assert.ok(kg.gridManager.gridCache['myTestId'], 'Grid was stored in cache');
        assert.ok(el['__koGrid__'], 'Grid was stored on element');

        kg.gridManager.clearGridCache();
    });

    QUnit.test('Grid Retreival Works', function(assert) {

        var el = document.createElement('DIV'),
            grid = { gridId: 'myTestId' },
            testGrid;

        kg.gridManager.storeGrid(el, grid);

        testGrid = kg.gridManager.getGrid(el);

        assert.ok(kg.gridManager.gridCache['myTestId'], 'Grid was stored in cache');
        assert.ok(testGrid, 'Grid was retrieved correctly');

        kg.gridManager.clearGridCache();
    });
})();
