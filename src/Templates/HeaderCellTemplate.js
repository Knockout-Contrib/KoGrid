kg.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img data-bind="visible: $data.sortAscVisible" src="../images/icon_sort_descending.png" />');
    b.append('  <img data-bind="visible: $data.sortDescVisible" src="../images/icon_sort_ascending.png" />');
    b.append('</div>');
    b.append('<div data-bind="visible: $data.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter" style="width: 80px" />');
    b.append('</div>');

    return b.toString();
};