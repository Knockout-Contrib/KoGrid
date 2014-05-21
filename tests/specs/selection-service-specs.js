'use strict';

describe('selectionService', function () {

    it('should throw an error if no grid is provided', function () {

        try {
            new window.kg.SelectionService();
        } catch (e) {
            expect(e).toBe("Grid is mandatory");
        }

    });


    it('should provide a selection service given a valid grid', function () {

        var selectionService = new window.kg.SelectionService(new window.kg.Grid());

        expect(selectionService).not.toBe(undefined);
        expect(selectionService.multi).toBe(true);
    });

    it('should toggle all the selection', function () {

        var grid = mock.gridFixture.grid();
        var selectionService = mock.gridFixture.getSelectionService(grid);

        selectionService.rowFactory.buildEntityRow(grid.filteredData()[0], 0);

        selectionService.toggleSelectAll(true);

        $.each(grid.filteredData(), function (i, item) {
            expect(item["__kg_selected__"]).toBe(true);
        });

        selectionService.toggleSelectAll(false);

        $.each(grid.filteredData(), function (i, item) {
            expect(item["__kg_selected__"]).toBe(false);
        });
    });
});