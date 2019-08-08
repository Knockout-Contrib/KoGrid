window.kg.StyleProvider = function (grid) {
    grid.canvasStyle = ko.computed(function() {
        return { "height": grid.maxCanvasHt().toString() + "px" };
    });
    grid.headerScrollerStyle = ko.computed(function() {
        return { "height": grid.config.headerRowHeight + "px" };
    });
    grid.topPanelStyle = ko.computed(function() {
        return { "width": grid.rootDim.outerWidth() + "px", "height": grid.topPanelHeight() + "px" };
    });
    grid.headerStyle = ko.computed(function() {
        var width = grid.fullHeight ? grid.rootDim.outerWidth() : Math.max(0, grid.rootDim.outerWidth() - window.kg.domUtilityService.ScrollW);
        return { "width": width + "px", "height": grid.config.headerRowHeight + "px" };
    });
    grid.headerPagerStyle = ko.computed(function() {
        var width = grid.fullHeight ? grid.rootDim.outerWidth() : Math.max(0, grid.rootDim.outerWidth() - window.kg.domUtilityService.ScrollW);
        return { "width": width + "px", "height": grid.config.headerPagerHeight + "px" };
    });
    grid.viewportStyle = ko.computed(function() {
        return { "width": grid.rootDim.outerWidth() + "px", "height": grid.viewportDimHeight() + "px" };
    });
	grid.footerStyle = ko.computed(function () {
        return { "width": grid.rootDim.outerWidth() + "px", "height": grid.config.footerRowHeight + "px" };
    });
};