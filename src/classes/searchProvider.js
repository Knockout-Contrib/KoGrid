window.kg.SearchProvider = function (grid) {
    var self = this,
        searchConditions = [],
        lastSearchStr;
    self.extFilter = grid.config.filterOptions.useExternalFilter;
    self.showFilter = grid.config.showFilter;
    self.filterText = grid.config.filterOptions.filterText;
    self.throttle = grid.config.filterOptions.filterThrottle;
    self.fieldMap = {};
    self.evalFilter = function () {
        if (searchConditions.length === 0) {
            grid.filteredData(grid.sortedData.peek().filter(function(item) {
                return !item._destroy;
            }));
        } else {
            grid.filteredData(grid.sortedData.peek().filter(function(item) {
                if (item._destroy) {
                    return false;
                }

                for (var i = 0, len = searchConditions.length; i < len; i++) {
                    var condition = searchConditions[i];
                    //Search entire row
                    if (!condition.column) {
                        for (var prop in item) {
                            if (item.hasOwnProperty(prop)) {
                                var c = self.fieldMap[prop];
                                if (!c) continue;
                                var pVal = ko.utils.unwrapObservable(item[prop]);
<<<<<<< HEAD
                                if (pVal && (condition.regex.test(pVal.toString()) || (typeof c.cellFilter === 'function' && condition.regex.test(c.cellFilter(pVal.toString)))))
=======
                                if (pVal && condition.regex.test(pVal.toString())) {
>>>>>>> 5fcb4c54bc80bf9082001c69f406d5fd1c3132f6
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    //Search by column.
<<<<<<< HEAD
                    var col = self.fieldMap[condition.columnDisplay];
                    if (!col) return false;
                    var value = ko.utils.unwrapObservable(item[condition.column]) || ko.utils.unwrapObservable(item[col.value]);
                    if (!value || !condition.regex.test(value.toString()) && !(typeof col.cellFilter === 'function' && condition.regex.test(col.cellFilter(value.toString()))))
=======
                    var field = ko.utils.unwrapObservable(item[condition.column]) || ko.utils.unwrapObservable(item[self.fieldMap[condition.columnDisplay]]);
                    if (!field || !condition.regex.test(field.toString())) {
>>>>>>> 5fcb4c54bc80bf9082001c69f406d5fd1c3132f6
                        return false;
                    }
                }
                return true;
            }));
        }
        grid.rowFactory.filteredDataChanged();
    };
    var getRegExp = function(str, modifiers) {
        try {
            return new RegExp(str, modifiers);
        } catch(err) {
            //Escape all RegExp metacharacters.
            return new RegExp(str.replace(/(\^|\$|\(|\)|\<|\>|\[|\]|\{|\}|\\|\||\.|\*|\+|\?)/g, '\\$1'));
        }
    };
    var buildSearchConditions = function (a) {
        //reset.
        searchConditions = [];
        var qStr;
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
                        regex: getRegExp(columnValue, 'i')
                    });
                }
            } else {
                var val = $.trim(args[0]);
                if (val) {
                    searchConditions.push({
                        column: '',
                        regex: getRegExp(val, 'i')
                    });
                }
            }
        });
    };

    var filterTextComputed = ko.computed(function () {
        var a = self.filterText();
        if (!self.extFilter && a != lastSearchStr) {
            //To prevent circular dependency when throttle is enabled.
            lastSearchStr = a;
            buildSearchConditions(a);
            self.evalFilter();
        }
    });
    if (typeof self.throttle === 'number') {
        filterTextComputed.extend({ throttle: self.throttle });
    }
    if (!self.extFilter) {
        grid.columns.subscribe(function (a) {
            $.each(a, function (i, col) {
                self.fieldMap[col.field] = col;
                self.fieldMap[col.displayName().toLowerCase().replace(/\s+/g, '')] = col;
            });
        });
    }
};
