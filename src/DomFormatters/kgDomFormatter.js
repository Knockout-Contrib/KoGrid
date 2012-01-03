kg.domFormatter = {
    formatGrid: function (element, grid) {
        element.className = 'kgGrid';
        element.style.position = "relative";
    },

    formatHeaderRow: function (element, headerRow) {
        element.style.height = headerRow.height + 'px';
    },

    formatRow: function (element, row) {
        var classes = 'kgRow';
        classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

        element['_kg_rowIndex_'] = row.rowIndex;
        element.style.position = "absolute";
        element.style.height = row.height() + 'px';
        element.style.top = row.offsetTop + 'px';
        element.style.width = row.width() + 'px';
        element.className = classes;
    },

    formatCell: function (element, cell) {
        //style the element correctly:
        element.style.position = "absolute";
        element.style.left = cell.offsetLeft() + 'px';
        element.style.width = cell.width() + 'px';
        element.style.right = cell.offsetRight() + 'px';
        element.style.height = '25px';
        element.className = "kgCell";

    }
};
