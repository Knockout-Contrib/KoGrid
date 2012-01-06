kg.generateRowTemplate = function (cols) {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="kgRow: $data">');

    utils.forEach(cols, function (col, i) {
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgCell: { value: \'{0}\' } "><input type="checkbox" data-bind="checked: $data.selected"/></div>', col.field);
        } else if (col.field === 'rowIndex') {
            b.append('<div class="kgRowIndexCell" data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        } else {
            b.append('  <div data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        }
    });
    b.append('</div>');

    return b.toString();
};