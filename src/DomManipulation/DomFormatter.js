kg.domFormatter = {

    formatHeaderRow: function (element, headerRow) {

    },

    formatHeaderCell: function (element, headerCell) {

        element.className += " kgHeaderCell col" + headerCell.colIndex;
    },

    formatRow: function (element, row) {
        var classes = 'kgRow';
        classes += (row.rowIndex % 2) === 0 ? ' even' : ' odd';

        element['_kg_rowIndex_'] = row.rowIndex;
        element.style.top = row.offsetTop + 'px';
        element.className = classes;
    },

    formatCell: function (element, cell) {

        

    },

    formatFooter: function (element, footer) {

    }
};
