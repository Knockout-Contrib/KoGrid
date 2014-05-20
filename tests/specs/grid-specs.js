'use strict';

describe('grid', function () {

    it('should create an empty instance of the grid without any data', function () {

        var grid = new window.kg.Grid();

        expect(grid).not.toBe(undefined);
        expect(grid.gridId).not.toBe(undefined);
    });
});