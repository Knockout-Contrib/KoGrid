/// <reference path="qunit/qunit.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />
/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../koGrid.debug.js" />

module('Column Initialization Tests');

test('Basic Column Initialization Test', function () {
    
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

    ok(col, 'Column Exists');
    equal(col.field, 'test', 'Column has the correct field');
    ok(col.hasCellTemplate, 'Reflects that it has a cell template');
    equal(col.width(), 20, 'Has the Correct Width');
});

