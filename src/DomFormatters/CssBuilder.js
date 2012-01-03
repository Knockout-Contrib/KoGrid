kg.cssBuilder = {

    buildStyles: function (grid) {
        var $style = $("<style type='text/css' rel='stylesheet' />");
        var rowHeight = (grid.config.rowHeight),
            gridId = grid.gridId,
            rules,
            i = 0,
            len = grid.columns().length,
            col;

        rules = [
            "." + gridId + " .kgHeaderRow { height:" + grid.config.headerRowHeight + "px; }",
            "." + gridId + " .kgCell { position: absolute; height:" + rowHeight + "px; overflow: hidden;}",
            "." + gridId + " .kgRow { position: absolute; width:" + grid.config.maxRowWidth() + "px; height:" + rowHeight + "px; }"
        ];

        for (; i < len; i++) {
            col = grid.columns()[i];
            rules.push("." + gridId + " .col" + i + " { left: " + col.offsetLeft() + "px; right: " + col.offsetRight() + "px; width: " + col.width() + "px; }");
        }

        if ($style[0].styleSheet) { // IE
            $style[0].styleSheet.cssText = rules.join(" ");
        }
        else {
            $style[0].appendChild(document.createTextNode(rules.join(" ")));
        }

        $('head')[0].appendChild($style[0]);
    }
};