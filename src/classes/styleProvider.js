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
        return { "width": Math.max(0, grid.rootDim.outerWidth() - window.kg.domUtilityService.ScrollW) + "px", "height": grid.config.headerRowHeight + "px" };
    });
    grid.viewportStyle = ko.computed(function() {
        return { "width": grid.rootDim.outerWidth() + "px", "height": grid.viewportDimHeight() + "px" };
    });
    grid.rowFooterStyle = ko.computed(function () {
        var result = $.extend({}, grid.headerStyle());
        result.bottom = kg.domUtilityService.ScrollW + 'px';
        return result;
    });
	grid.footerStyle = ko.computed(function () {
        return { "width": grid.rootDim.outerWidth() + "px", "height": grid.config.footerRowHeight + "px" };
    });
};