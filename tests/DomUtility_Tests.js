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

    ok(scrollH, 'Scroll Height is not zero');
    ok(scrollW, 'Scroll Width is not zero');
});
