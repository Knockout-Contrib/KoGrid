kg.defaultGridInnerTemplate = function () {
    return  '<div class="kgTopPanel" data-bind="kgSize: $data.headerDim">' +
                '<div class="kgHeaderContainer" style="position: relative; overflow-x: hidden" data-bind="kgSize: $data.headerDim">' +
                    '<div class="kgHeaderScroller" data-bind="kgHeaderRow: $data">' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="kgViewport" style="overflow: auto;" data-bind="kgSize: $data.viewportDim">' +
                '<div class="kgCanvas" data-bind="kgRows: $data.rows" style="position: relative">' +
                '</div>' +
            '</div>' +
            '<div class="kgFooterPanel" data-bind="kgFooter: $data, kgSize: $data.footerDim">' +
                
            '</div>';
};