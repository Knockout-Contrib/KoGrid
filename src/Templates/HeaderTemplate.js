kg.templates.generateHeaderTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns,
        showFilter = options.showFilter;

    var hasHeaderGroups = false;
    var headerGroups = { };
    kg.utils.forEach(cols, function (col, i) {
        if (col.headerGroup) {
            if (!headerGroups[col.headerGroup]) {
                headerGroups[col.headerGroup] = {width: 0, columns: []};
            }
            headerGroups[col.headerGroup].width += col.width();
            headerGroups[col.headerGroup].columns.push(col);
            hasHeaderGroups = true;
        } else {
            if (!headerGroups["unassigned"]) {
                headerGroups["unassigned"] = { width: 0, columns: [] };
            }
            headerGroups["unassigned"].columns.push(col);
        }
    });

    if (hasHeaderGroups) {
        b.append('<tr style="style="position: absolute; line-height: 30px; top: 0px; ">');
        kg.utils.forIn(headerGroups, function (group) {
            if (group.columns.length > 0) {
                b.append('<th class="kgHeaderCell" colspan="{1}">{2}</th>', group.width, group.columns.length, group.columns[0].headerGroup);
            }
        });
        b.append('</tr>');
    }
    b.append('<tr style="position: absolute; line-height: 30px; height 30px; top: {0}px}">', hasHeaderGroups ? "30" : "0");
    kg.utils.forEach(cols, function (col) {
        if (col.field === '__kg_selected__') {
            b.append('<th class="kgSelectionCell" data-bind="kgHeader: { value: \'{0}\' }, css: { \'kgNoSort\': {1} }">', col.field, !col.allowSort);
            b.append('  <input type="checkbox" data-bind="checked: $parent.toggleSelectAll"/>');
            b.append('</th>');
        } else if (col.field === 'rowIndex' && showFilter) {
            b.append('<th data-bind="kgHeader: { value: \'{0}\' }, css: { \'kgNoSort\': {1} }">', col.field, !col.allowSort);
            b.append('      <div title="Filter Results" class="kgFilterBtn openBtn" data-bind="visible: !$data.filterVisible(), click: $parent.showFilter_Click"></div>');
            b.append('      <div title="Close" class="kgFilterBtn closeBtn" data-bind="visible: $data.filterVisible, click: $parent.showFilter_Click"></div>');
            b.append('      <div title="Clear Filters" class="kgFilterBtn clearBtn" data-bind="visible: $data.filterVisible, click: $parent.clearFilter_Click"></div>');
            b.append('</th>');
        } else {
            b.append('<th data-bind="kgHeader: { value: \'{0}\' }, style: { width: $parent.columns()[{1}].width + \'px\'}, css: { \'kgNoSort\': {2} }">', col.field, col.index, !col.allowSort);
            b.append('</th>');
        }
    });
    b.append('</tr>');
    return b.toString();
};
