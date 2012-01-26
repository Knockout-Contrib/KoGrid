kg.templates.defaultHeaderCellTemplate = function () {
    var b = new kg.utils.StringBuilder();

    b.append('<div data-bind="click: $data.sort">');
    b.append('  <span data-bind="text: $data.displayName"></span>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.noSortVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAHhJREFUKFONkNEJwCAMRP3oCP11EadxBMUfQcGJneHqCRFbBStIJHk5L1FqOrVWGGPAOOfHmwWtNay1PS6gAM45xBjB+AK/QM55BdnhvUcIASkllFIGJIrdUyvc7V5bs0xSiR3iZ/5OhlC/PFHtOJ34OO5pBncbfwCrHKMbaQIX3AAAAABJRU5ErkJggg=="/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortAscVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAEVJREFUKFPVzsEJADAIA8As4iLuv44zpFiwpKEL9CGRcIggiZmqYmayU/sLRAQBsFPhRl0MaOTwCRzCLwxQeH7SR33/Fi1hef+4O/q8GwAAAABJRU5ErkJggg=="/>');
    b.append('  <img class="kgSortImg" data-bind="visible: $data.sortDescVisible" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAERJREFUKFNj+P//PwMhTFAByIBBqUhWVhboMgacGCz/9u3b/7gUgsRB8mDfYVMIU4ASBMgKkRVghBNIoZWVFdgK5FgAAMGr/7gho9mEAAAAAElFTkSuQmCC"/>');
    b.append('</div>');
    b.append('<div data-bind="visible: $parent.filterVisible">');
    b.append('  <input type="text" data-bind="value: $data.column.filter, valueUpdate: \'afterkeydown\'" style="width: 80%" tabindex="1" />');
    b.append('</div>');

    return b.toString();
};