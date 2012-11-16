kg.templates.generateRowTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns;

    b.append('<div data-bind="kgRow: $data, click: $data.toggleSelected, css: { \'kgSelected\': $data.selected }">');

    kg.utils.forEach(cols, function (col, i) {

        // check for the Selection Column
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgCell: { value: \'{0}\' } ">', col.field);
            b.append('  <input type="checkbox" data-bind="checked: $data.selected" />');
            b.append('</div>');
        }
        // check for RowIndex Column
        else if (col.field === 'rowIndex') {
            b.append('<div class="kgRowIndexCell" data-bind="kgCell: { value: \'{0}\' } "></div>', col.field);
        }
        // check for a Column with a Cell Template
        else if (col.hasCellTemplate) {
            // first pull the template
            var tmpl = kg.templateManager.getTemplate(col.cellTemplate).innerHTML;

            // build the replacement text
            var replacer = "{ value: '" + col.field + "' }";

            // run any changes on the template for re-usable templates
            tmpl = tmpl.replace(/\$cellClass/g, col.cellClass || 'kgEmpty');
            tmpl = tmpl.replace(/\$cellValue/g, "$data['" + col.field + "']");
            tmpl = tmpl.replace(/\$cell/g, replacer);

            b.append(tmpl);
        }
        // finally just use a basic template for the cell
        else {
            var rv;
            if (col.cellFilter) {
                rv = col.cellFilter + '($data[\'{1}\'])';
            } else {
                rv = '$data[\'{1}\']';
            }
            var cellTemplate = '<div class="{0}" data-bind="kgCell: { value: \'{1}\' }"><span class="kgCellText" data-bind="text: $cellValue"></span></div>'.replace(/\$cellValue/g, rv);
            b.append(cellTemplate, col.cellClass || 'kgEmpty', col.field);
        }
    });

    b.append('</div>');

    return b.toString();
};