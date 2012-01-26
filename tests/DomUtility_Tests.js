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

//1/26/12 - EMB - removed since we don't have a good way of measuring min dimensions without breaking scrollbars
//test("Measure Container Min Dimensions", function () {

//    var $container = $('<div style="min-height: 100px; min-width: 100px;"></div>').appendTo($('body'));

//    var dims = kg.domUtility.measureElementMinDims($container);

//    equals(dims.minWidth, 100, 'Min Width is correct');
//    equals(dims.minHeight, 100, 'Min Height is correct');

//    $container.remove();
//});

//test('Measure Full Grid Test', function () {

//    var $container = $('<div style="min-height: 99px; min-width: 98px; max-height: 201px; max-width: 202px;"></div>').appendTo($('body'));

//    var fakeGrid = {
//        elementDims: {
//            rootMaxH: 0,
//            rootMinH: 0,
//            rootMaxW: 0,
//            rootMinW: 0
//        }
//    };

//    kg.domUtility.measureGrid($container, fakeGrid);

//    equals(fakeGrid.elementDims.rootMaxH, 201, 'Max Height is correct');
//    equals(fakeGrid.elementDims.rootMaxW, 202, 'Max Height is correct');

//    equals(fakeGrid.elementDims.rootMinH, 99, 'Min Height is correct');
//    equals(fakeGrid.elementDims.rootMinW, 98, 'Min Width is correct');

//    //now append a few things to the container, so we can check that the assertions still work after the container has children
//    $container.append("<div style='height: 2000px; width: 2000px;'></div>");

//    equals(fakeGrid.elementDims.rootMaxH, 201, 'Max Height is correct');
//    equals(fakeGrid.elementDims.rootMaxW, 202, 'Max Height is correct');

//    equals(fakeGrid.elementDims.rootMinH, 99, 'Min Height is correct');
//    equals(fakeGrid.elementDims.rootMinW, 98, 'Min Width is correct');

//    $container.remove();

//});