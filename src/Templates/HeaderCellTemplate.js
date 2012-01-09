kg.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<span data-bind="text: $data.displayName"></span>');
    b.append('<button data-bind="click: $data.sort">S</button>');
    b.append('<button data-bind="click: $data.showFilter">F</button>');
    b.append('<div data-bind="visible: $data.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter" style="width: 80px" />');
    b.append('</div>');

    return b.toString();
};