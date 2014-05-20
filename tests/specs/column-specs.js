'use strict';

describe('column', function () {

    it('should create a proper instance of the column', function () {

        var colDef = {
            field: 'test',
            displayName: 'TEST',
            minWidth: 20,
            maxWidth: 250
        };

        var grid = mock.gridFixture.grid();
        var column = new window.kg.Column({
            colDef: colDef,
            index: 0,
            headerRowHeight: grid.config.headerRowHeight,
            sortCallback: grid.sortData,
            resizeOnDataCallback: grid.resizeOnData,
            enableResize: grid.config.enableColumnResize,
            enableSort: grid.config.enableSorting
        }, grid);

        expect(column).not.toBe(undefined);
        expect(column.field).toBe("test");
        expect(column.minWidth).toBe(20);
        expect(column.maxWidth).toBe(250);
    });
});