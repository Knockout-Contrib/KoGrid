kg.domFormatter = {
    formatGrid: function (element, grid) {

        $(element).addClass("kgGrid").addClass(grid.gridId.toString());

        element.style.position = "relative";
    },

    formatHeaderRow: function (element, headerRow) {

    },

    formatHeaderCell: function (element, headerCell) {

        element.className = "kgHeaderCell col" + headerCell.colIndex;
    },

    formatRow: function (element, row) {
        var classes = 'kgRow';
        classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

        element['_kg_rowIndex_'] = row.rowIndex;
        element.style.top = row.offsetTop + 'px';
        element.className = classes;
    },

    formatCell: function (element, cell) {

        element.className += " kgCell " + "col" + cell.column.index;

    },

    formatFooter: function (element, footer) {

    }
};
