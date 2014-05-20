'use strict';

describe('rowFactory', function () {

    it('should throw an error if no grid is provided', function () {

        try {
            new window.kg.RowFactory();
        } catch (e) {
            expect(e).toBe("Grid is mandatory");
        }

    });

    it('should create a valid row factory instance given a valid grid', function () {

        var rowFactory = new window.kg.RowFactory(mock.gridFixture.grid({ groups: ['prop1'] }));

        expect(rowFactory).not.toBe(undefined);
        expect(rowFactory.rowCache.length).toBe(0);
        expect(rowFactory.rowConfig.canSelectRows).toBe(true);
        expect(rowFactory.renderedRange.topRow).toBe(0);
        expect(rowFactory.renderedRange.bottomRow).toBe(8);

    });

    it('should check for late bounds', function () {

        var grid = mock.gridFixture.grid();

        var rowFactory = new window.kg.RowFactory(grid);

        expect(rowFactory.dataChanged).toBe(false);

        $.each(grid.columns(), function (i, colDef) {
            if(colDef.field === "prop1") {
                expect(colDef.displayName()).toBe("Property One");
            }

        });

        grid.lateBoundColumns = true;

        rowFactory.filteredDataChanged();

        expect(rowFactory).not.toBe(undefined);
        expect(rowFactory.dataChanged).toBe(true);
        expect(grid.columnDefs).toBe(undefined);

        $.each(grid.columns(), function (i, colDef) {
            if(colDef.field === "prop1") {
                expect(colDef.displayName()).toBe("prop1");
            }

        });
    });

});