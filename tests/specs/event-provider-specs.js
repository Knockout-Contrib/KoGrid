'use strict';

describe('eventProvider', function () {

    it('should throw an error if no grid is provided', function () {

        try {
            new window.kg.EventProvider();
        } catch (e) {
            expect(e).toBe("Grid is mandatory");
        }

    });


    it('should provide an event service given a valid grid', function () {

        var grid = mock.gridFixture.grid();

        var eventProvider = new window.kg.EventProvider(grid);

        expect(eventProvider).not.toBe(undefined);

        //triggering all the events
        grid.$viewport.scroll();
        grid.$viewport.keydown();
        $(window).resize();
    });

});