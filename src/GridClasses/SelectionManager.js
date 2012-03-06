/******************************
* Use cases to support:
* 1. Always keep a selectedItem in single select mode
*   - first item is selected by default (if selection is enabled)
* 2. Don't keep both selectedItem/selectedItems in sync - pick one
* 3. Remember selectedIndex, and if user deletes an item in the array - reselect the next index
* 4. If Single Select, don't pick a selected item on first data load
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

            if (!keep) {
                currentItems.remove(changedEntity);
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
            if (maxRows() === 0) {
                return false;
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
                    self.selectedItems([]);
                }
            }
        }
    });

    //make sure as the data changes, we keep the selectedItem(s) correct
    dataSource.subscribe(function (items) {
        var selectedItems, selectedItem, itemsToRemove;

        if (!items) {
            return;
        }

        //make sure the selectedItem/Items exist in the new data
        if (isMulti) {
            selectedItems = self.selectedItems();
            itemsToRemove = [];

            ko.utils.arrayForEach(selectedItems, function (item) {
                if (ko.utils.arrayIndexOf(items, item) < 0) {
                    itemsToRemove.push(item);
                }
            });

            //clean out any selectedItems that don't exist in the new array
            if (itemsToRemove.length > 0) {
                self.selectedItems.removeAll(itemsToRemove);
            }

        } else {
            selectedItem = self.selectedItem();

            if (selectedItem && ko.utils.arrayIndexOf(items, selectedItem) < 0) {
                self.selectedItem(items[0] ? items[0] : null);
            }
        }
    });
};