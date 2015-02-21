(function() {
    'use strict';
    /*global QUnit,kg*/

    QUnit.module('Column Initialization Tests');

    QUnit.test('Basic Column Initialization Test', function(assert) {

        var colDef = {
            field: 'test',
            displayName: 'TEST',
            width: 20,
            cellTemplate: 'myTmpl',
            cellClass: 'myCellClass',
            headerClass: 'myHeaderClass',
            headerTemplate: 'myHeaderTmpl'
        };

        var col = new kg.Column(colDef);

        assert.ok(col, 'Column Exists');
        assert.equal(col.field, 'test', 'Column has the correct field');
        assert.ok(col.hasCellTemplate, 'Reflects that it has a cell template');
        assert.equal(col.width(), 20, 'Has the Correct Width');
    });
})();
