kg.generateHeaderTemplate = function (cols) {
    var b = new kg.utils.StringBuilder();

    utils.forEach(cols, function (col, i) {
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgHeader: { value: \'{0}\' } "><input type="checkbox" data-bind="checked: $parent.toggleSelectAll"/></div>', col.field);
        } else if (col.field === 'rowIndex') {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' } "><img data-bind="click: $parent.showFilter_Click" src="../images/icon_filter.gif"/></div>', col.field);
        } else {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('</div>');
        }
    });

    return b.toString();
};