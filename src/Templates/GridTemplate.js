kg.defaultGridInnerTemplate = function () {
    return  '<div class="kgTopPanel">' +
                '<div class="kgHeaderContainer" style="position: relative; overflow-x: hidden">' +
                    '<div class="kgHeaderScroller" data-bind="kgHeaderRow: $data">' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="kgViewport" style="overflow: auto;">' +
                '<div class="kgCanvas" data-bind="kgRows: $data.rows" style="position: relative">' +
                '</div>' +
            '</div>' +
            '<div class="kgFooterPanel" data-bind="kgFooter: $data">' +
                
            '</div>';
};