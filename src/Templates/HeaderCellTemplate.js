kg.templates.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.noSortVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAEFJREFUKFNjYICC+vp6YyDeDcSCMDEwDRRQAuK7QPwfpAAuiSYBkkQoAHLOQAVgEjB6FYrxGBy8OvHaide1+PwJAMBIWUlZ9vlNAAAAAElFTkSuQmCC"/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortAscVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAADpJREFUGFdjqK+vZ4BiYyC9G4gFYWIwCSWgwF0g/g9VABYHEcgSIEm4ApDkGagATAJGr2L4//8/TgwAbitNeAMDSF8AAAAASUVORK5CYII="/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortDescVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAADFJREFUGFdjYMAH6uvrzwDxfyx4FQNQUAmI76JJ7oYbiKYAIQFTAVRgDMS7gVgQJgYAcwQspeOio+wAAAAASUVORK5CYII="/>');
    b.append('</div>');
    b.append('<div data-bind="visible: $parent.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter, valueUpdate: \'afterkeydown\'" style="width: 80%" tabindex="1" />');
    b.append('</div>');

    return b.toString();
};