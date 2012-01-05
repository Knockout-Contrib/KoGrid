/// <reference path="../../lib/jquery-1.7.js" />
/// <reference path="../../lib/knockout-2.0.0.debug.js" />
/// <reference path="../KoGrid.js" />

kg.cssBuilder = {

    buildStyles: function (grid) {
        var $style = grid.$style;

        if (!$style) {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($('head'));
        }

        var rowHeight = (grid.config.rowHeight - grid.elementDims.rowHdiff),
            gridId = grid.gridId,
            rules,
            i = 0,
            len = grid.columns().length,
            col,
            colWidth;
        
        rules = [
            "." + gridId + " .kgCell { height:" + rowHeight + "px }",

            "." + gridId + " .kgRow { position: absolute; width:" + grid.config.maxRowWidth() + "px; height:" + rowHeight + "px; line-height:" + rowHeight + "px; }",

            "." + gridId + " .kgSelectionCell { width:" + grid.elementDims.rowSelectedCellW + "px;}",

            "." + gridId + " .kgRowIndexCell { width:" + grid.elementDims.rowIndexCellW + "px; }"
        ];

        for (; i < len; i++) {
            col = grid.columns()[i];
            colWidth = col.width() - grid.elementDims.cellWdiff;
            rules.push("." + gridId + " .col" + i + " { left: " + col.offsetLeft() + "px; right: " + col.offsetRight() + "px; width: " + colWidth + "px; }");
        }

        if ($style[0].styleSheet) { // IE
            $style[0].styleSheet.cssText = rules.join(" ");
        }
        else {
            $style[0].appendChild(document.createTextNode(rules.join(" ")));
        }

        grid.$styleSheet = $style;
    }
};