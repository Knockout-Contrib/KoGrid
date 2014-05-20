'use strict';

describe('searchProvider', function () {

    it('should throw an error if no grid is provided', function () {

        try {
            new window.kg.SearchProvider();
        } catch (e) {
            expect(e).toBe("Grid is mandatory");
        }

    });

    it('should search given a valid filtering', function () {

        var grid = mock.gridFixture.grid({
            filterOptions: {
                filterText: ko.observable("test1")
            }
        });

        var searchProvider = new window.kg.SearchProvider(grid);

        expect(searchProvider).not.toBe(undefined);
        expect(grid.filteredData().length).toBe(1);
    });
});