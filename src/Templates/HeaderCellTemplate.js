kg.templates.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort, css: { \'kgSorted\': !$data.noSortVisible() }">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <div class="kgSortButtonDown" data-bind="style: { left: $data.leftPosition }, visible: ($data.allowSort() ? ($data.noSortVisible() || $data.sortAscVisible) : $data.allowSort())"></div>');
    b.append('  <div class="kgSortButtonUp" data-bind="style: { left: $data.leftPosition }, visible: ($data.allowSort() ? ($data.noSortVisible() || $data.sortDescVisible) : $data.allowSort())"></div>');
    b.append('</div>');
    b.append('<div class="kgHeaderGrip" data-bind="visible: $data.allowResize, mouseEvents: { mouseDown:  $data.gripOnMouseDown }"></div>');
    b.append('<div data-bind="visible: $data._filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter, valueUpdate: \'afterkeydown\'" style="width: 80%" tabindex="1" />');
    b.append('</div>');

    return b.toString();
};