/// <reference path="../../lib/jquery-1.7.js" />
/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../KoGrid.js" />

kg.cssBuilder = {

    buildStyles: function (grid) {
        var rowHeight = (grid.config.rowHeight - grid.elementDims.rowHdiff),
            $style = grid.$styleSheet,
            gridId = grid.gridId,
            rules,
            i = 0,
            len = grid.columns().length,
            css = new kg.utils.StringBuilder(),
            col,
            sumWidth = 0,
            colWidth;

        if (!$style) {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($('head'));
        }
        $style.empty();

        css.append(".{0} .kgCell { height: {1}px; }", gridId, rowHeight);
        css.append(".{0} .kgRow { position: absolute; width: {1}px; height: {2}px; line-height: {2}px; display: inline; }",gridId, grid.totalRowWidth(), rowHeight);
        css.append(".{0} .kgHeaderCell { height: {1}px; }", gridId, rowHeight);
        css.append(".{0} .kgHeaderScroller { line-height: {1}px; }", gridId, rowHeight);
        

        for (; i < len; i++) {
            col = grid.columns()[i];
            
            colWidth = col.width() - grid.elementDims.cellWdiff;

            css.append(".{0} .col{1} { left: {2}px; right: {3}px; width: {4}px; }", gridId, i, sumWidth, (grid.totalRowWidth() - sumWidth - col.width()), colWidth);

            sumWidth += col.width();

        }

        if ($style[0].styleSheet) { // IE
            $style[0].styleSheet.cssText = css.toString(" ");
        }
        else {
            $style[0].appendChild(document.createTextNode(css.toString(" ")));
        }

        grid.$styleSheet = $style;
    }
};