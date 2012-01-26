/// <reference path="qunit/qunit.js" />

module("Row Manager Tests");

kg.getTestGrid = function () {
    return {
        columns: ko.observableArray([
            new kg.Column({ field: 'firstName' }),
            new kg.Column({ field: 'lastName' }),
            new kg.Column({ field: 'age' })
        ]),
        finalData: ko.observableArray([
            { firstName: 'John', lastName: 'Doe', age: 45 },
            { firstName: 'Jane', lastName: 'Doe', age: 42 },
            { firstName: 'Tim', lastName: 'Smith', age: 36 },
        ]),
        minRowsToRender: ko.observable(3),
        config: {
            rowHeight: 30
        },
        changeSelectedItem: function (handler) {

        }
    };
};

test('Row Manager Smoke Test', function () {

    var grid = kg.getTestGrid();

    var manager = new kg.RowManager(grid);

    ok(manager, 'Manager Instantiated!');
});

test('Row Manager Basic Row Test', function () {

    var grid = kg.getTestGrid();
    var manager = new kg.RowManager(grid);

    manager.viewableRange(new kg.Range(0, 3));

    equals(manager.rows().length, 3, 'And returned the correct # of rows');
});

test('Rows Dont Update When viewable Range doesnt change', function () {

    var grid = kg.getTestGrid();
    var manager = new kg.RowManager(grid);
    var rowsUpdated = false;

    manager.viewableRange(new kg.Range(0, 3));

    manager.rows.subscribe(function () {
        rowsUpdated = true;
    });

    manager.viewableRange(new kg.Range(0, 3));
    manager.viewableRange(new kg.Range(0, 2));
    manager.viewableRange(new kg.Range(0, 1));

    ok(!rowsUpdated, "Rows didn't update multiple times");
});

