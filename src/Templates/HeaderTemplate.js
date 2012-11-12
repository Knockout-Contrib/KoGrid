kg.templates.generateHeaderTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns;

    var hasHeaderGroups = false;
    var headerGroups = { };
    var leftMargin = 0;
    var prevHeaderGroup;
    kg.utils.forEach(cols, function (col, i) {
	    if (col.headerGroup) {
	        if (!headerGroups[col.headerGroup]) {
	            var newGroup = {
	                width: ko.computed(function () {
	                    var hgs = options.headerGroups();
	                    if (!hgs || !hgs[col.headerGroup]) return 0;
	                    var arr = hgs[col.headerGroup].columns;
	                    var width = 0;
	                    kg.utils.forEach(arr, function (column) {
	                        width += column.width();
	                    });
	                    return width - 1;
	                }),
	                columns: [],
	                margin: ko.observable(leftMargin),
	                rightHeaderGroup: "",
	                parent: headerGroups
	            };
	            headerGroups[col.headerGroup] = newGroup;
	            if (prevHeaderGroup) headerGroups[prevHeaderGroup].rightHeaderGroup = col.headerGroup;
	            prevHeaderGroup = col.headerGroup;
	            hasHeaderGroups = true;
	        }
	        headerGroups[col.headerGroup].columns.push(col);
	    } else {
	        if (prevHeaderGroup) headerGroups[prevHeaderGroup].rightHeaderGroup = col.headerGroup;
	        if ((options.displayRowIndex && options.displaySelectionCheckbox && i > 1) || 
	           (options.displayRowIndex && !options.displaySelectionCheckbox && i > 0) ||
	           (options.displaySelectionCheckbox && !options.displayRowIndex && i > 0)) {
	            if (!headerGroups[i]) {
	                headerGroups[i] = {
	                    width: ko.computed(function () {
	                        var hgs = options.headerGroups();
	                        if (!hgs || !hgs[col.headerGroup]) return 0;
	                        var arr = hgs[col.headerGroup].columns;
	                        var width = 0;
	                        kg.utils.forEach(arr, function (column) {
	                            width += column.width();
	                        });
	                        return width - 1;
	                    }),
	                    columns: [],
	                    margin: ko.observable(leftMargin),
	                    rightHeaderGroup: "",
	                    parent: headerGroups
	                };
	            }
	            if (!prevHeaderGroup) prevHeaderGroup = i;
	        }
	    }
	    leftMargin += col.width();
	});

    if (hasHeaderGroups) {
        options.headerGroups(headerGroups);
        b.append('<div style="position: absolute; line-height: 30px; height: 30px; top: 0px; left:0px; right: 17px; ">');
        kg.utils.forIn(headerGroups, function (group) {
            if (group.columns.length > 0) {
                b.append('<div class="kgHeaderGroupContainer" data-bind="style: { width: $parent.headerGroups()[\'{0}\'].width() + \'px\', left: $parent.headerGroups()[\'{0}\'].margin() + \'px\' }" style="position: absolute; text-align: center;">{0}</div>',group.columns[0].headerGroup ? group.columns[0].headerGroup : "");
            }
        });
        b.append('</div>');
        b.append('<div style="position: absolute; line-height: 30px; height 30px; top: 31px; ">');
    }
    
    kg.utils.forEach(cols, function (col) {
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgHeader: { value: \'{0}\' }, css: { \'kgNoSort\': {1} }">', col.field, !col.allowSort, col.index);
            b.append('  <input type="checkbox" data-bind="visible: $parent.isMultiSelect, checked: $parent.toggleSelectAll"/>');
            b.append('</div>');
        } else if (col.field === 'rowIndex' &&  options.showFilter) {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' }, css: { \'kgNoSort\': {1} },">', col.field, !col.allowSort, col.index);
            b.append('<div title="Toggle Filter" class="kgFilterBtn" data-bind="css:{\'closeBtn\' : $data.filterVisible() == true, \'openBtn\' : $data.filterVisible() == false }, click: $parent.showFilter_Click"></div>');
            b.append('<div title="Clear Filters" class="kgFilterBtn clearBtn" data-bind="visible: $data.filterVisible, click: $parent.clearFilter_Click"></div>');
            b.append('</div>');
        } else {
            b.append('<div style="height: 30px; border-right: {3}; " data-bind="kgHeader: { value: \'{0}\' }, css: { \'kgNoSort\': {2} }">', col.field, col.index, !col.allowSort, col.index === (cols.length - 1) ? '1px solid black': '0');
            b.append('</div>');
        }
    });
    if (hasHeaderGroups) {
        b.append('</div>');
    }
    return b.toString();
};
