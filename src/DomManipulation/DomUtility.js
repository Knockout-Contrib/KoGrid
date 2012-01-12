kg.domUtility = (function () {
    var $testContainer = $('<div></div>'),
        scrollH,
        scrollW;

    $testContainer.appendTo($('body'));
    // 1. Run all the following measurements on startup!

    //measure Scroll Bars
    $testContainer.height(100).width(100).css("position", "absolute").css("overflow", "scroll");
    $testContainer.append('<div style="height: 400px; width: 400px;"></div>');
    scrollH = $testContainer.height() - $testContainer[0].clientHeight;
    scrollW = $testContainer.width() - $testContainer[0].clientWidth;
    $testContainer.empty();


    $testContainer.remove();

    return {
        assignGridContainers: function (rootEl, grid) {

            grid.$root = $(rootEl);

            //Headers
            grid.$topPanel = $(".kgTopPanel", grid.$root[0]);
            grid.$headerContainer = $(".kgHeaderContainer", grid.$topPanel[0]);
            grid.$headerScroller = $(".kgHeaderScroller", grid.$headerContainer[0]);
            grid.$headers = grid.$headerContainer.children();

            //Viewport
            grid.$viewport = $(".kgViewport", grid.$root[0]);

            //Canvas
            grid.$canvas = $(".kgCanvas", grid.$viewport[0]);

            //Footers
            grid.$footerPanel = $(".kgFooterPanel", grid.$root[0]);
        },
                
        measureElementMaxDims: function ($container) {
            var dims = {};

            $container.append("<div style='height: 20000px; width: 20000px;'></div>");

            dims.maxWidth = $container.width();
            dims.maxHeight = $container.height();

            return dims;
        },
        scrollH: scrollH,
        scrollW: scrollW
    };
} ());