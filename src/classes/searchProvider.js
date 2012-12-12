kg.SearchProvider = function (grid) {
    var self = this,
        searchConditions = [];
    self.extFilter = grid.config.filterOptions.useExternalFilter;
    self.showFilter = grid.config.showFilter;
    self.filterText = grid.config.filterOptions.filterText;
    self.throttle = grid.config.filterOptions.filterThrottle;
    self.fieldMap = {};
    self.evalFilter = function () {
        if (searchConditions.length === 0)
            grid.filteredData(grid.sortedData());
        else {
            grid.filteredData(grid.sortedData().filter(function (item) {
                for (var i = 0, len = searchConditions.length; i < len; i++) {
                    var condition = searchConditions[i];
                    //Search entire row
                    if (!condition.column) {
                        for (var prop in item) {
                            if (item.hasOwnProperty(prop)) {
                                var pVal = ko.utils.unwrapObservable(item[prop]);
                                if (pVal && condition.regex.test(pVal.toString()))
                                    return true;
                            }
                        }
                        return false;
                    }
                    //Search by column.
                    var field = ko.utils.unwrapObservable(item[condition.column]) || ko.utils.unwrapObservable(item[self.fieldMap[condition.columnDisplay]]);
                    if (!field || !condition.regex.test(field.toString()))
                        return false;
                }
                return true;
            }));
        }
        grid.rowFactory.filteredDataChanged();
    };
    var buildSearchConditions = function (a) {
        //reset.
        searchConditions = [];
        var qStr = '';
        if (!(qStr = $.trim(a))) {
            return;
        }
        var columnFilters = qStr.split(";");
        $.each(columnFilters, function (i, filter) {
            var args = filter.split(':');
            if (args.length > 1) {
                var columnName = $.trim(args[0]);
                var columnValue = $.trim(args[1]);
                if (columnName && columnValue) {
                    searchConditions.push({
                        column: columnName,
                        columnDisplay: columnName.replace(/\s+/g, '').toLowerCase(),
                        regex: new RegExp(columnValue, 'i')
                    });
                }
            } else {
                var val = $.trim(args[0]);
                if (val) {
                    searchConditions.push({
                        column: '',
                        regex: new RegExp(val, 'i')
                    });
                }
            }
        });
    };

    var filterTextComputed = ko.computed(function () {
        var a = self.filterText();
        if (self.extFilter) return;

        buildSearchConditions(a);

        self.evalFilter();
    });
    if (typeof self.throttle === 'number') {
        filterTextComputed.extend({ throttle: self.throttle });
    }
    if (!self.extFilter) {
        grid.columns.subscribe(function (a) {
            $.each(a, function (i, col) {
                self.fieldMap[col.displayName().toLowerCase().replace(/\s+/g, '')] = col.field;
            });
        });
    }
};