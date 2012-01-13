kg.Row = function (entity) {
    var self = this;
    this.entity = ko.isObservable(entity) ? entity : ko.observable(entity);
    //selectify the entity
    if (this.entity()['__kg_selected__'] === undefined) {
        this.entity()['__kg_selected__'] = ko.observable(false);
    }

    this.selected = ko.dependentObservable({
        read: function () {
            var val = self.entity()['__kg_selected__']();
            return val;
        },
        write: function (val) {
            self.entity()['__kg_selected__'](val);
            self.onSelectionChanged();
        }
    });

    this.toggleSelected = function () {
        if (self.selected()) {
            self.selected(false);
        } else {
            self.selected(true);
        }
    };

    this.cells = ko.observableArray([]);
    this.cellMap = {};
    this.rowIndex = 0;
    this.offsetTop = 0;
    this.height = ko.observable(0);
    this.width = ko.observable(0);

    this.onSelectionChanged = function () { }; //replaced in rowManager

};