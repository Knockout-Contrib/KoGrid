kg.domRuler = (function () {

    return {
        measureRow: function ($container) {
            var diffs = {};

            var $dummyRow = $('<div></div>').addClass("kgRow").appendTo($container);

            diffs.rowHdiff = $dummyRow.outerHeight() - $dummyRow.height();
            diffs.rowWdiff = $dummyRow.outerWidth() - $dummyRow.width();

            $dummyRow.remove();
            return diffs;
        },

        measureCell: function ($container) {
            var diffs = {};

            var $dummyRow = $('<div></div>').addClass("kgRow").appendTo($container);
            var $dummyCell = $('<div></div>').addClass("kgCell").appendTo($dummyRow);

            diffs.cellHdiff = $dummyCell.outerHeight() - $dummyCell.height();
            diffs.cellWdiff = $dummyCell.outerWidth() - $dummyCell.width();

            $dummyRow.remove();
            return diffs;
        },

        measureScrollBar: function ($container) {
            var dim = {};

            dim.scrollH = Math.ceil($container.height() - parseFloat($container[0].clientHeight));
            dim.scrollW = Math.ceil($container.width() - parseFloat($container[0].clientWidth));

            return dim;
        },

        measureHeader: function ($container) {
            var diffs = {};

            var $dummyCell = $('<div></div>').addClass("kgHeaderCell").appendTo($container);

            diffs.headerCellHdiff = $dummyCell.outerHeight() - $dummyCell.height();
            diffs.headerCellWdiff = $dummyCell.outerWidth() - $dummyCell.width();

            diffs.headerHdiff = $container.outerHeight() - $container.height();
            diffs.headerWdiff = $container.outerWidth() - $container.width();

            $dummyCell.remove();
            return diffs;
        },

        measureFooter: function ($container) {
            var diffs = {};

            diffs.footerHdiff = $container.outerHeight() - $container.height();
            diffs.footerWdiff = $container.outerWidth() - $container.width();

            return diffs;

        }
    };
} ());