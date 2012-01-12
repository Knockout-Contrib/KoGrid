kg.templates.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortAscVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAERJREFUeNpi/P//PwMySE9PBwvMnDmTEVmcCZsidDaKQnQJdDEmXIrQFTMhK0J2FzIbpIYJmwQ2MUayfI0PDKBCgAADALw1Jt+DRlRcAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortDescVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrEkDEOACAIA6Hxr7yJ12JwahCNmzeWklI0IoQxsyW4u7IOeeSjcZyOr+VQhc6UaL6nMzGZhlssz1CFzrS15kFdnAIMAII6I3XoVkIHAAAAAElFTkSuQmCC"/>');
    b.append('</div>');
    b.append('<div data-bind="visible: $data.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter, valueUpdate: \'afterkeydown\', hasfocus: $data.filterHasFocus" style="width: 80%" tabindex="1" />');
    b.append('</div>');

    return b.toString();
};