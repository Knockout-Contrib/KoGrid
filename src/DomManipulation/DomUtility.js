kg.domUtility = (new function () {
    var $testContainer = $('<div></div>'),
        self = this;

    this.assignGridContainers = function (rootEl, grid) {

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
    };

    this.measureElementMaxDims = function ($container) {
        var dims = {};

        var $test = $("<div style='height: 20000px; width: 20000px;'></div>");

        $container.append($test);

        dims.maxWidth = $container.width();
        dims.maxHeight = $container.height();

        $test.remove();

        return dims;
    };

    this.measureElementMinDims = function ($container) {
        var dims = {};

        $container.children().hide();

        var $test = $("<div style='height: 0x; width: 0px;'></div>");
        $container.append($test);

        $container.wrap("<div style='width: 1px;'></div>");

        dims.minWidth = $container.width();
        dims.minHeight = $container.height();

        $container.unwrap();
        $container.children().show();

        return dims;
    };

    this.measureGrid = function ($container, grid) {

        //find max sizes
        var dims = self.measureElementMaxDims($container);

        grid.elementDims.rootMaxW = dims.maxWidth;
        grid.elementDims.rootMaxH = dims.maxHeight;

        //find min sizes
        dims = self.measureElementMinDims($container);

        grid.elementDims.rootMinW = dims.minWidth;
        grid.elementDims.rootMinH = dims.minHeight;

        //set scroll measurements
        grid.elementDims.scrollW = kg.domUtility.scrollW;
        grid.elementDims.scrollH = kg.domUtility.scrollH;
    };

    this.scrollH = 17; // default in IE, Chrome, & most browsers
    this.scrollW = 17; // default in IE, Chrome, & most browsers
    this.letterW = 2;

    $(function () {
        $testContainer.appendTo('body');
        // 1. Run all the following measurements on startup!

        //measure Scroll Bars
        $testContainer.height(100).width(100).css("position", "absolute").css("overflow", "scroll");
        $testContainer.append('<div style="height: 400px; width: 400px;"></div>');
        self.scrollH = ($testContainer.height() - $testContainer[0].clientHeight);
        self.scrollW = ($testContainer.width() - $testContainer[0].clientWidth);
        $testContainer.empty();

        //clear styles
        $testContainer.attr('style', '');

        //measure letter sizes
        $testContainer.append('<span><strong>M</strong></span>');
        self.letterW = $testContainer.children().first().width();

        $testContainer.remove();
    });

} ());