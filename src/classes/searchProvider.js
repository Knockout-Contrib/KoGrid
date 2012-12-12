kg.SearchProvider = function(grid) {
    var self = this;
    self.field = "";
    self.value = "";
    self.extFilter = grid.config.filterOptions.useExternalFilter;
    self.showFilter = grid.config.showFilter;
    self.filterText = grid.config.filterOptions.filterText;
    self.fieldMap = {};
    self.evalFilter = function() {
        var ft = self.filterText().toLowerCase();
        var v = self.value;
        grid.filteredData(grid.sortedData().filter(function (item) {
            if (!ft) {
                return true;
            }
            var field = ko.utils.unwrapObservable(item[self.field]);
            var fieldMap = ko.utils.unwrapObservable(item[self.fieldMap[self.field]]);
            if (!self.field) {
                var obj = {};
                for (var prop in item) {
                    if (item.hasOwnProperty(prop)) {
                        obj[prop] = ko.utils.unwrapObservable(item[prop]);
                    } 
                }
                return JSON.stringify(obj).toLowerCase().indexOf(ft) != -1;
            } else if (field && self.value) {
                return field.toString().toLowerCase().indexOf(v) != -1;
            } else if (fieldMap && self.value) {
                return fieldMap.toString().toLowerCase().indexOf(v) != -1;
            }
            return true;
        }));
        grid.rowFactory.filteredDataChanged();
    };
    self.filterText.subscribe(function(a) {
        grid.config.filterOptions.filterText = a;
        if (self.extFilter) return;
        self.premise = a.split(':');
        if (self.premise.length > 1) {
            self.field = self.premise[0].trim().toLowerCase().replace(' ', '_');
            self.value = self.premise[1].trim().toLowerCase();
        } else {
            self.field = "";
            self.value = self.premise[0].trim().toLowerCase();
        }
        self.evalFilter();
    });
    if (!self.extFilter) {
        grid.columns.subscribe(function(a) {
            $.each(a, function (i, col) {
                self.fieldMap[col.displayName().toLowerCase().replace(' ', '_')] = col.field;
            });
        });
    }
};