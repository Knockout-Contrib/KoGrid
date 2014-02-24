window.kg.AggregationProvider = function (grid) {
	var self = this;
	function getGridCount(row, field, condition) {
		var count = 0;
		if (row.aggChildren && row.aggChildren.length) {
			for (var i = row.aggChildren.length - 1; i >= 0; i--) {
				count += getGridCount(row.aggChildren[i], field, condition);
			}
		} else if (row.children) {
			var children = row.children;
			if (condition === "") count = Number(children.length) || 0;
			else if (condition === "true") {
				for (var idx = children.length - 1; idx >= 0; idx--) {
					var child = children[idx];
					var val = child[field.field];
					if (val === "true" || val === true) count++;
				}
			}
			else count = "#NotImplemented";
		} else {
			// this is a non agg row and we're counting it?
			// count = 1;
			count = 0;
		}
		return count;
	}

	function getGridSum(row, field) {
		if (!row) return;

		var result = 0;
		if (row.aggChildren && row.aggChildren.length > 0) {
			//TODO: implement koUnwrapper, or refrence ko.
			var aggChildren = row.aggChildren;
			for (var idx = aggChildren.length - 1; idx >= 0; idx--) {
				var aggChild = aggChildren[idx];
				if (aggChild) {
					result += getGridSum(aggChild, field);
				}
			}
		} else if (row.children && row.children.length) {
			var children = row.children;
			for (var i = children.length - 1; i >= 0; i--) {
				var child = children[i];
				if (child && child[field.field]) {
					// TODO: add a field to entity to indicate grouping, use that to deturmine whether to sum or count the fields.
					var val = ko.utils.unwrapObservable(child[field.field]);
					if (Number(val)) result += Number(val);
					//else if (val == "true") result += 1;
				}
			}
		}
		return result;
	}

	function getGridMin(row, field, min) {
		var result,
			children,
			getVal;
		min = min || function (a, b) {return a > b ? b : a;};
		var getMin = function (a, b) {if (typeof a != "number") return b; if (typeof b != "number") return a; return min (a, b); };
		if (row.aggChildren && row.aggChildren.length > 0) {
			children = row.aggChildren;
			getVal = getGridMin;

		} else if (row.children && row.children.length) {
			children = row.children;
			getVal = function (row) {return row[field.field];};
		} else {
			return;
		}
		for (var idx = children.length - 1; idx >= 0; idx--) {
			var child = children[idx];
			var val = /*Number*/(getVal(child, field, getMin));
			result = getMin(result, val);
		}
		return result;
	}

	function getGridAny(row, field) {
		return getGridMin(row, field, function (a, b) {return a || b;});
	}
	function getWeightedSum(row, field) {
		if (!row) return;

		var result = 0;
		if (row.aggChildren && row.aggChildren.length > 0) {
			//TODO: implement koUnwrapper, or refrence ko.
			var aggChildren = row.aggChildren;
			for (var idx = aggChildren.length - 1; idx >= 0; idx--) {
				var aggChild = aggChildren[idx];
				if (aggChild) {
					result += getWeightedSum(aggChild, field);
				}
			}
		} else if (row.children && row.children.length) {
			var children = row.children;
			for (var i = children.length - 1; i >= 0; i--) {
				var child = children[i];
				if (child && child[field.field]) {
					// TODO: add a field to entity to indicate grouping, use that to deturmine whether to sum or count the fields.
					var val = child[field.field] * child[field.field + "_weight"];
					result += Number(val);
				}
			}
		}
		return result;
	}

		function getFld(field, flexView) {
			if (!flexView) return 1;
			var column = flexView.flexFields().filter(function (a) {return a.field == field;})[0];
			if (column) {
				return column.fld;
			}
		}

	self.sum = {
		sql: function (field) {
			return 'sum(' + field.fld + ')';
		},
		grid: function (row, field) {
			return getGridSum(row, field);
		}
	};
	self.asis = {
		sql: function (field) {
			return field.fld;
		},
		grid: function (row, field) {
			return row[field.field];
		}
	};
	self.count = {
		sql: function (field) {
			return 'sum(iif(' + field.fld + ',1,0))';
		},
		grid: function (row, field) {
			return getGridSum(row, field);
		}
	};
	self.gridCount = {
		grid: function (row, field) {
			var text = getGridCount(row, field, "");
			return text;
		}
	};
	self.sibling = function (siblingField) {
		return {
			grid: function (row, field) { return getGridMin(row, {field: siblingField}, function (a, b) { return a > b ? a : b; }); }
		};
	};
	self.average = {
		sql: function (field) {
			return 'avg(' + field.fld + ')';
		},
		grid: function (row, field) {
			return getWeightedSum(row, field) / getGridSum(row, {field: field.field + "_weight"});
		}
	};
	self.min = {
		sql: function (field) {
			return 'min(' + field.fld + ')';
		},
		grid: getGridMin
	};
	self.max = {
		sql: function (field) {
			return 'max(' + field.fld + ')';
		},
		grid: function (row, field) { return getGridMin(row, field, function (a, b) { return a > b ? a : b; }); }
	};
	self.weightedAvg = {
		sql: function (field, flexView) {
			var fld = field.fld;
			var weight = getFld(field.weightedColumn, flexView);
			return 'sum(' + fld + ' * ' + weight + ')' + ' / sum(' + weight + ')';
		},
		grid: function (row, field) {
			return getWeightedSum(row, field) / getGridSum(row, {field: field.weightedColumn});
		}
	};
	self.countDistinct = {
		sql: function (field, flexView) {
			return 'count(distinct ' + field.fld + ")";
		},
		grid: function (row, field) {
			return getGridSum(row, field);
		}
	};
	self.any = {
		grid: getGridAny
	};
};
