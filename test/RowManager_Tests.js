(function() {
    'use strict';
    /*global QUnit,kg,ko*/

    QUnit.module("Row Manager Tests");

    kg.getTestGrid = function () {
        return {
            columns: ko.observableArray([
                new kg.Column({ field: 'firstName' }),
                new kg.Column({ field: 'lastName' }),
                new kg.Column({ field: 'age' })
            ]),
            finalData: ko.observableArray([//45 rows
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 },
                { firstName: 'John', lastName: 'Doe', age: 45 },
                { firstName: 'Jane', lastName: 'Doe', age: 42 },
                { firstName: 'Tim', lastName: 'Smith', age: 36 }
            ]),
            minRowsToRender: ko.observable(3),
            config: {
                rowHeight: 30,
                currentPage: ko.observable(1),
                pageSize: ko.observable(100),
                plugins: []
            },
            changeSelectedItem: function (handler) {
            }
        };
    };

    QUnit.test('Row Manager Smoke Test', function(assert) {

        var grid = kg.getTestGrid();

        var manager = new kg.RowManager(grid);

        assert.ok(manager, 'Manager Instantiated!');
    });

    QUnit.test('Row Manager Basic Row Test', function(assert) {

        var grid = kg.getTestGrid();
        var manager = new kg.RowManager(grid);

        manager.viewableRange(new kg.Range(0, 3));

        assert.equals(manager.rows().length, 11, 'And returned the correct # of rows');
    });

    // See Issue #28 & #26 on Github
    QUnit.test('Single Row Appears', function(assert) {

        var grid = kg.getTestGrid();

        var singleRow = grid.finalData()[0];

        grid.finalData([]); // empty it out

        //set a single row
        grid.finalData.push(singleRow);

        var manager = new kg.RowManager(grid);
        manager.viewableRange(new kg.Range(0, 1));

        assert.equals(manager.rows().length, 1, 'And returned the correct # of rows');
    });

    QUnit.test('Rows Dont Update When viewable Range doesnt change', function(assert) {

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

        assert.ok(!rowsUpdated, "Rows didn't update multiple times");
    });

    QUnit.test('viewableRange stays the same when dataSource is changed!', function(assert) {

        var grid = kg.getTestGrid();
        grid.minRowsToRender(10);

        var manager = new kg.RowManager(grid);
        var viewRg, renderRg, dataChanged = false;

        manager.viewableRange(new kg.Range(20, 30));
        assert.equals(manager.rows().length, 26, 'And returned the correct # of rows');

        viewRg = manager.viewableRange();
        renderRg = manager.renderedRange();

        assert.equals(viewRg.topRow, 30, "Correct Top Row");
        assert.equals(viewRg.bottomRow, 20, "Correct Top Row");

        assert.equals(renderRg.topRow, 38, "Correct Top Row");
        assert.equals(renderRg.bottomRow, 12, "Correct Top Row");

        manager.rows.subscribe(function () {
            dataChanged = true;
        });

        grid.finalData.sort(function (a, b) {
            return (a === b) ? 0 : (a > b) ? 1 : -1; //don't really care, just need to trigger the mutation
        });

        viewRg = manager.viewableRange();
        renderRg = manager.renderedRange();

        assert.ok(dataChanged, 'Data was sorted and actually changed');
        assert.equals(viewRg.topRow, 30, "Correct Top Row");
        assert.equals(viewRg.bottomRow, 20, "Correct Top Row");

        assert.equals(renderRg.topRow, 38, "Correct Top Row");
        assert.equals(renderRg.bottomRow, 12, "Correct Top Row");
    });

    QUnit.test('RowIndex stays in tune with paging', function(assert) {

        var grid = kg.getTestGrid();
        grid.minRowsToRender(10);
        grid.config.currentPage(2);
        grid.config.pageSize(100);

        var manager = new kg.RowManager(grid);

        //kickoff a rendering
        manager.viewableRange(new kg.Range(0, 3));

        //test the row
        var row = manager.rows()[0];

        assert.ok(row, 'The row was rendered correctly');
        assert.equals(row.rowIndex, 1, "The underlying rowIndex was correctly calculated");
        assert.equals(row.rowDisplayIndex, 101, "The rowDisplayIndex was correctly calculated");
    });
})();
