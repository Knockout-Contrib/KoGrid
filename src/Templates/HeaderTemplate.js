kg.templates.generateHeaderTemplate = function (options) {
    var b = new kg.utils.StringBuilder(),
        cols = options.columns,
        showFilter = options.showFilter;

    utils.forEach(cols, function (col, i) {
        if (col.field === '__kg_selected__') {
            b.append('<div class="kgSelectionCell" data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('  <input type="checkbox" data-bind="checked: $parent.toggleSelectAll, visible: $parent.config.isMultiSelect"/>');
            b.append('</div>');
        } else if (col.field === 'rowIndex' && showFilter) {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('  <img class="kgFilterImg"  data-bind="click: $parent.showFilter_Click" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALdJREFUOE+lU9ERxSAIcyd3cid2ciceGPOUVnvt+UGV6yWBgElV00kcgV24ERSpWkSnYI4zlxoiZWn5RKBqHFotxD44e24Xv0s/KeYkfwJUAQDBAIFoVIeKUoZ6IJhJADLl1tZoA2AoLwnuJFSncgTfKiCrK7kXrQIza6W8rSCSwIfUHV/ty3YPfEz0giP7RIA24MHVuEcT+dNVfaRcot26b1uIFYy5X4kePXD1eW0/efD2hR6/xh98LfKQ4yD0/gAAAABJRU5ErkJggg=="/>');
            b.append('  <img class="kgClearFilter" data-bind="visible: $data.filterVisible, click: $parent.clearFilter_Click" style="display: none;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABVklEQVQ4T2NgGBQgbeaZ/2kz//8v63jy/xcL+/89ThFgPkzcOO3Mf7OUE/9PSZmAMYvRtP8gMbjjQYqBZvw/A8S729r+A2X+b56xD8yfCZQAyR2Kqvj/h5X9f03TWrDhDMYzEQaATAIJgjSA8H17//9fhcT/L+h7C9bcWHsRbOislDaoZiTbkcMQZsjibSCvsP6/Yp/1P2/Cgf9vBWX/b1H1wm4zeiTADNndtgJs6x0lq/8feYX+FwBdg+FsXDEICZMz/x9qe4INmZi7nXjNMENBMQIKNJABU7VCUAOMUNoBqmYBRddncdn/c5KawYYAsS8hfXB5oOIUkKZ1C0+BA26RkDnIgB9ALETQEKAiNZDmNpsKcJSCEoxj3F6YAYvwGgByOhA/AuK9GdN+g9MAJNEAGUAvQL0SjtMQoIIJUKeqgWwGJ1dgioMlW6DcIqi8NEGv0E0BAJoSBFFFVzBnAAAAAElFTkSuQmCC" />');
            b.append('</div>');
        } else {
            b.append('<div data-bind="kgHeader: { value: \'{0}\' } ">', col.field);
            b.append('</div>');
        }
    });

    return b.toString();
};