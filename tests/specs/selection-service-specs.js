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
});