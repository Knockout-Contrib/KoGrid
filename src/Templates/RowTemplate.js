kg.templates.generateRowTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns;

    b.append('<div data-bind="kgRow: $data, click: $data.toggleSelected">');

    utils.forEach(cols, function (col, i) {
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgCell: { value: \'{0}\' } ">', col.field);
            b.append('  <input type="checkbox" data-bind="checked: $data.selected" />');
            b.append('</div>');
        } else if (col.field === 'rowIndex') {
            b.append('<div class="kgRowIndexCell" data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        } else {
            b.append('  <div data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        }
    });

    b.append('</div>');

    return b.toString();
};