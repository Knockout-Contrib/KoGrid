/// <reference path="qunit/qunit.js" />

module("DomUtility Tests");

test("Measure Container Max Dimensions", function () {

    var $container = $('<div style="max-height: 100px; max-width: 100px;"></div>').appendTo($('body'));

    var dims = kg.domUtility.measureElementMaxDims($container);

    equals(dims.maxWidth, 100, 'Max Width is correct');
    equals(dims.maxHeight, 100, 'Max Height is correct');

    $container.remove();
});

test("Measure ScrollBars Occurred", function () {

    var scrollH = kg.domUtility.scrollH;
    var scrollW = kg.domUtility.scrollW;

    ok(scrollH, 'Scroll Height is ' + scrollH);
    ok(scrollW, 'Scroll Width is ' + scrollW);
    ok(scrollH < 100, 'ScrollH is less than 100');
    ok(scrollW < 100, 'ScrollW is less than 100');
});

test("Measure Container Min Dimensions", function () {
    var $wrapper = $('<div style="height: 0px; width: 0px;"></div>').appendTo($('body'));
    var $container = $('<div style="min-height: 100px; min-width: 100px;"></div>').appendTo($wrapper);

    var dims = kg.domUtility.measureElementMinDims($container);

    equals(dims.minWidth, 100, 'Min Width is correct');
    equals(dims.minHeight, 100, 'Min Height is correct');

    $container.remove();
    $wrapper.remove();
});

test("No Visibility - Measure Container Max Dimensions", function () {
    var $wrapper = $('<div style="height: 200px; width: 200px; display: none;"></div>').appendTo($('body'));
    var $container = $('<div style="max-height: 100px; max-width: 100px;"></div>').appendTo($wrapper);

    var dims = kg.domUtility.measureElementMaxDims($container);

    equals(dims.maxWidth, 100, 'Max Width is correct');
    equals(dims.maxHeight, 100, 'Max Height is correct');

    $container.remove();
    $wrapper.remove();
});

test("No Visibility - Measure Container Min Dimensions", function () {
    var $wrapper = $('<div style="height: 0px; width: 0px; display: none;"></div>').appendTo($('body'));
    var $container = $('<div style="min-height: 100px; min-width: 100px;"></div>').appendTo($wrapper);

    var dims = kg.domUtility.measureElementMinDims($container);

    equals(dims.minWidth, 100, 'Min Width is correct');
    equals(dims.minHeight, 100, 'Min Height is correct');

    $container.remove();
    $wrapper.remove();
});

test("Measure percentage-based dimensions - Maximum", function () {
    var $wrapper = $('<div style="height: 200px; width: 200px;"></div>').appendTo($('body'));
    var $container = $('<div style="height: 70%; width: 70%;"></div>').appendTo($wrapper);

    var dims = kg.domUtility.measureElementMaxDims($container);

    equals(dims.maxWidth, 140, 'Width is correct');
    equals(dims.maxHeight, 140, 'Height is correct');

    $container.remove();
    $wrapper.remove();
});

test("Measure percentage-based dimensions - Minimum", function () {
    var $wrapper = $('<div style="height: 200px; width: 200px;"></div>').appendTo($('body'));
    var $container = $('<div style="height: 70%; width: 70%;"></div>').appendTo($wrapper);

    var dims = kg.domUtility.measureElementMinDims($container);

    equals(dims.minWidth, 140, 'Width is correct');
    equals(dims.minHeight, 140, 'Height is correct');

    $container.remove();
    $wrapper.remove();
});

test('Measure Full Grid Test', function () {

    var $wrapper = $('<div style="height: 0px; width: 0px;"></div>').appendTo($('body'));
    var $container = $('<div style="min-height: 99px; min-width: 98px; max-height: 201px; max-width: 202px;"></div>').appendTo($wrapper);

    var fakeGrid = {
        config: {
            headerRowHeight: 2,
            rowHeight: 2,
            footerRowHeight: 4
        },
        elementDims: {
            rootMaxH: 0,
            rootMinH: 0,
            rootMaxW: 0,
            rootMinW: 0
        }
    };

    kg.domUtility.measureGrid($container, fakeGrid, true);

    equals(fakeGrid.elementDims.rootMaxH, 201, 'MaxHeight before change is correct');
    //equals(fakeGrid.elementDims.rootMaxW, 202, 'MaxWidth before change is correct');

    equals(fakeGrid.elementDims.rootMinH, 99, 'MinHeight before change is correct');
    equals(fakeGrid.elementDims.rootMinW, 98, 'MinWidth before change is correct');

    //now append a few things to the container, so we can check that the assertions still work after the container has children
    $container.append("<div style='height: 2000px; width: 2000px;'></div>");
    $wrapper.width(300);
    $wrapper.height(300);

    equals(fakeGrid.elementDims.rootMaxH, 201, 'Max Height after change is correct');
    //equals(fakeGrid.elementDims.rootMaxW, 202, 'Max Width after change is correct');

    equals(fakeGrid.elementDims.rootMinH, 99, 'Min Height after change is correct');
    equals(fakeGrid.elementDims.rootMinW, 98, 'Min Width after change is correct');

    $container.remove();
    $wrapper.remove();

});