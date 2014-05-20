'use strict';

describe('dimension', function () {

    it('should create a custom dimension object', function () {

        var dimension = new window.kg.Dimension();

        expect(dimension).not.toBe(undefined);
        expect(dimension.outerHeight).not.toBe(undefined);
        expect(dimension.outerHeight).toBe(0);
        expect(dimension.outerWidth).not.toBe(undefined);
        expect(dimension.outerWidth).toBe(0);
    });

    it('should create a custom dimension object', function () {

        var dimension = new window.kg.Dimension({
            outerHeight: 100,
            outerWidth: 200
        });

        expect(dimension).not.toBe(undefined);
        expect(dimension.outerHeight).not.toBe(undefined);
        expect(dimension.outerHeight).toBe(100);
        expect(dimension.outerWidth).not.toBe(undefined);
        expect(dimension.outerWidth).toBe(200);
    });
});