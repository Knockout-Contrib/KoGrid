/******************************
* Use cases to support:
* 1. Always keep a selectedItem
*   - first item is selected by default (if selection is enabled)
* 2. Don't keep both selectedItem/selectedItems in sync - pick one
* 3. Remember selectedIndex, and if user deletes an item in the array - reselect the next index
*/

kg.SelectionManager = function (options) {
    var self = this,
        isMulti = options.isMultiSelect,
        dataSource = options.data,
        KEY = '__kg_selected__',
        maxRows = ko.computed(function () {
            return dataSource().length;
        });

    this.selectedItem = options.selectedItem; //observable
    this.selectedItems = options.selectedItems; //observableArray
    this.selectedIndex = options.selectedIndex; //observable

    this.selectedItemCount = ko.computed(function () {
        var single = self.selectedItem(),
            arr = self.selectedItems();

        if (!isMulti) {
            return (single !== null && single !== undefined) ? 1 : 0; //truthy statement
        } else {
            return arr.length;
        }
    });

    this.selectedItem.subscribe(function (currentEntity) {
        //ensure outgoing entity is de-selected
        if (!isMulti) {
            //uncheck the current entity
            if (currentEntity && currentEntity[KEY]) {
                currentEntity[KEY](false);
            }
        }
    }, self, "beforeChange");

    this.selectedItem.subscribe(function (entity) {
        //ensure incoming entity has our selected flag
        if (entity && !entity[KEY]) {
            entity[KEY] = ko.observable(true);
        } else if (entity) {
            entity[KEY](true);
        }
    });

    this.selectedItems.subscribe(function (newItems) {
        if (!newItems) {
            newItems = [];
        }

        utils.forEach(dataSource(), function (item, i) {

            if (!item[KEY]) {
                item[KEY] = ko.observable(false);
            }

            if (ko.utils.arrayIndexOf(newItems, item) > -1) {
                //newItems contains the item
                item[KEY](true);
            } else {
                item[KEY](false);
            }

        });
    });

    this.changeSelectedItem = function (changedEntity) {
        var currentEntity = self.selectedItem(),
            currentItems = self.selectedItems,
            len = 0,
            keep = false;

        if (!isMulti) {
            //Single Select Logic

            //find out if the changed entity is selected or not
            if (changedEntity && changedEntity[KEY]) {
                keep = changedEntity[KEY]();
            }

            if (keep) {
                //set the new entity
                self.selectedItem(changedEntity);
            } else {
                //always keep a selected entity around
                changedEntity[KEY](true);
            }

        } else {
            //Multi-Select Logic
            len = currentItems().length;

            //if the changed entity was de-selected, remove it from the array
            if (changedEntity && changedEntity[KEY]) {
                keep = changedEntity[KEY]();
            }

            if (!keep && (len > 1)) {
                currentItems.remove(changedEntity);
            } else if (!keep && (len <= 1)) {
                changedEntity[KEY](true);
            } else {
                //first see if it exists, if not add it
                if (currentItems.indexOf(changedEntity) === -1) {
                    currentItems.push(changedEntity);
                }
            }
        }
    };

    this.toggleSelectAll = ko.computed({
        read: function () {
            var cnt = self.selectedItemCount();
            if (!isMulti) {
                return cnt === 1;
            }
            return cnt === maxRows();
        },
        write: function (val) {
            var checkAll = val,
                selectedItemsToPush = [],
                data;

            if (isMulti) {
                data = dataSource();

                if (checkAll) {
                    self.selectedItems(data);
                } else {
                    self.selectedItems(data[0] ? [data[0]] : []);
                }
            }
        }
    });

    //now ensure we always have at least one item selected
    (function (items) {
        if (items && items.length > 0) {
            if (!items[0][KEY]) {
                items[0][KEY] = ko.observable(true);
                self.changeSelectedItem(items[0]);
            }
        }
    } (dataSource()));
};