/// <reference path="../utils.js" />
/// <reference path="../namespace.js" />
/// <reference path="../Grid.js" />

kg.Row = function (entity, config, rowCache) {
    var self = this,
        KEY = '__kg_selected__', // constant for the selection property that we add to each data item
        canSelectRows = config.canSelectRows;
    this.rows = rowCache;
    this.selectedItems = config.selectedItems;
    this.entity = ko.isObservable(entity) ? entity : ko.observable(entity);

    //selectify the entity
    if (this.entity()['__kg_selected__'] === undefined) {
        this.entity()['__kg_selected__'] = ko.observable(false);
    }
    this.selected = ko.dependentObservable({
        read: function () {
            if (!canSelectRows) {
                return false;
            }
            var val = self.entity()['__kg_selected__']();
            return val;
        },
        write: function (val) {
            if (!canSelectRows) {
                return true;
            }
            self.entity()['__kg_selected__'](val);
            self.onSelectionChanged();
        }
    });

    this.toggleSelected = function (data, event) {
        if (!canSelectRows) {
            return true;
        }
        var element = event.target;

        //check and make sure its not the bubbling up of our checked 'click' event 
        if (element.type == "checkbox" && element.parentElement.className.indexOf("kgSelectionCell" !== -1)) {
            return true;
        } 
        if (config.selectWithCheckboxOnly && element.type != "checkbox"){
            return true;
        } else if (event.shiftKey) {
            document.getSelection().removeAllRanges();
            if(config.lastClickedRow()) {
                var thisIndx = self.rows.indexOf(self);
                var prevIndex = self.rows.indexOf(config.lastClickedRow());
                if (thisIndx < prevIndex) {
                    thisIndx = thisIndx ^ prevIndex;
                    prevIndex = thisIndx ^ prevIndex;
                    thisIndx = thisIndx ^ prevIndex;
                }
                for (; prevIndex <= thisIndx; prevIndex++) {
                    self.rows[prevIndex].selected(true);
                    //first see if it exists, if not add it
                    if (self.selectedItems.indexOf(self.rows[prevIndex].entity()) === -1) {
                        self.selectedItems.push(self.rows[prevIndex].entity());
                    }
                }
            }
        } else if (event.ctrlKey) {
            self.toggle(self);
        } else {
            utils.forEach(self.selectedItems(), function (item) {
                item.myRowEntity.selected(false);
            });
            self.selectedItems.removeAll();
            self.toggle(self);
        }
        config.lastClickedRow(self);
        return true;
    };

    this.toggle = function(item) {
        if (item.selected()) {
            item.selected(false);
            self.selectedItems.remove(item.entity());
        } else {
            item.selected(true);
            if (self.selectedItems.indexOf(item.entity()) === -1) {
                self.selectedItems.push(item.entity());
            }
        }

    };

    this.cells = ko.observableArray([]);
    this.cellMap = {};
    this.rowIndex = 0;
    this.offsetTop = 0;
    this.rowKey = utils.newId();
    this.rowDisplayIndex = 0;

    this.onSelectionChanged = function () { }; //replaced in rowManager

    //during row initialization, let's make all the entities properties first-class properties on the row
    (function () {

        utils.forIn(entity, function (prop, propName) {

            self[propName] = prop;

        });

    } ());
};