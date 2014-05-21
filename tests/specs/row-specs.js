'use strict';

describe('row', function () {

    it('should throw an error if valid params are not provided', function () {

        try {
            new window.kg.Row();
        } catch (e) {
            expect(e).toBe("Entity is mandatory");
        }

        try {
            new window.kg.Row({ });
        } catch (e) {
            expect(e).toBe("Config is mandatory");
        }

        try {
            new window.kg.Row({ }, { });
        } catch (e) {
            expect(e).toBe("SelectionService is mandatory");
        }

    });

    it('should create a valid instance of a row given valid params', function () {

        var grid = mock.gridFixture.grid();
        var row =  mock.gridFixture.row(0, grid);

        expect(row).not.toBe(undefined);
        expect(row.selected()).toBe(false);
    });

    it('should change the row selection', function () {

        var grid = mock.gridFixture.grid();
        var firstRow =  mock.gridFixture.row(0, grid);
        firstRow.selectionService.multi = true;

        expect(firstRow.entity["__kg_selected__"]).toBe(false);
        firstRow.continueSelection();
        expect(firstRow.entity["__kg_selected__"]).toBe(true);

        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'shiftKey': true
        });

        firstRow.continueSelection(event);

        firstRow.selectionService.multi = false;
        firstRow.continueSelection(event);

        firstRow.selectionService.multi = true;

        var secondRow =  mock.gridFixture.row(1, grid);

        expect(secondRow.entity["__kg_selected__"]).toBe(false);
        secondRow.continueSelection(event);
        expect(secondRow.entity["__kg_selected__"]).toBe(true);

        firstRow.selectionService.multi = false;
        secondRow.continueSelection(event);
        expect(secondRow.entity["__kg_selected__"]).toBe(true);


    });

    it('should get a given property', function () {

        var grid = mock.gridFixture.grid();
        var firstRow =  mock.gridFixture.row(0, grid);

        expect(firstRow.getProperty("prop1")).toBe('test1');
    });
});