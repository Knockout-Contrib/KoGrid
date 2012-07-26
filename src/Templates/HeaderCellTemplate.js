kg.templates.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort, css: { \'kgSorted\': !$data.noSortVisible() }">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.allowSort() && $data.noSortVisible()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAEFJREFUKFNjYICC+vp6YyDeDcSCMDEwDRRQAuK7QPwfpAAuiSYBkkQoAHLOQAVgEjB6FYrxGBy8OvHaide1+PwJAMBIWUlZ9vlNAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortAscVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAAPElEQVQoU2NggIL6+npjIN4NxIIwMTANFFAC4rtA/B+kAC6JJgGSRCgAcs5ABWASMHoVw////3HigZAEACKmlTwMfriZAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortDescVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAAPUlEQVQoU2P4//8/Ay6MUwKkgQJJBnygvr7+DBD/x4JXMQAFlYD4LprkbriBaAoQEjAVQAXGQLwbiAVhYgD6kIBR+tr9IgAAAABJRU5ErkJggg=="/>');
    b.append('</div>');
    b.append('<div data-bind="visible: $parent.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter, valueUpdate: \'afterkeydown\'" style="width: 80%" tabindex="1" />');
    b.append('</div>');

    return b.toString();
};