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

				var found = false;
				for (var i = 0, len = searchConditions.length; i < len; i++) {
					var condition = searchConditions[i];
					//Search entire row
					if (!condition.column) {
						for (var prop in item) {
							if (item.hasOwnProperty(prop)) {
								var pVal = ko.utils.unwrapObservable(item[prop]);
								if (pVal && condition.regex.test(pVal.toString())) {
									return true;
								}
							}
						}
					} else {
						//Search by column.
						var field = ko.utils.unwrapObservable(item[condition.column]) || ko.utils.unwrapObservable(item[self.fieldMap[condition.columnDisplay]]);
						if (field && condition.regex.test(field.toString())) {
							found = true;
						} else if (condition.required) {
							return false;
						}
					}
				}

				return found;
			}));
		}
		grid.rowFactory.filteredDataChanged();
	};
	var getRegExp = function(str, modifiers) {
		try {
			return new RegExp(str, modifiers);
		} catch(err) {
			//Escape all RegExp metacharacters.
			return new RegExp(str.replace(/(\^|\$|\(|\)|\[|\]|\{|\}|\\|\||\.|\*|\+|\?)/g, '\\$1'));
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
				var required = true;

				// if column value should be optional, append ? to its name, like:
				// first_name?:John;last_name?:Smith

				if (columnName[columnName.length-1] === '?') {
					required = false;
					columnName = columnName.replace('?', '');
				}

				if (columnName && columnValue) {
					searchConditions.push({
						column: columnName,
						columnDisplay: columnName.replace(/\s+/g, '').toLowerCase(),
						regex: getRegExp(columnValue, 'i'),
						required: required
					});
				}
			} else {
				var val = $.trim(args[0]);
				if (val) {
					searchConditions.push({
						column: null,
						regex: getRegExp(val, 'i'),
						required: false
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
				self.fieldMap[col.displayName().toLowerCase().replace(/\s+/g, '')] = col.field;
			});
		});
	}
};
