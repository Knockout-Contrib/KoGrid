﻿window.kg.Column = function (config, grid) {
	var self = this,
		colDef = config.colDef,
		delay = 500,
		clicks = 0,
		timer = null;
	self.eventTarget = undefined;
	self.width = colDef.width;
	self.groupIndex = ko.observable(0);
	self.isGroupedBy = ko.observable(false);
	self.groupedByClass = ko.computed(function(){ return self.isGroupedBy() ? "kgGroupedByIcon": "kgGroupIcon";});
	self.sortable = ko.observable(false);
	self.resizable = ko.observable(false);
	self.minWidth = !colDef.minWidth ? 50 : colDef.minWidth;
	self.maxWidth = !colDef.maxWidth ? 9000 : colDef.maxWidth;
	self.headerRowHeight = config.headerRowHeight;
	self.displayName = ko.observable(colDef.displayName || colDef.field);
	self.index = config.index;
	self.isAggCol = config.isAggCol;
	self.cellClass = ko.observable(colDef.cellClass || "");
	self.cellFilter = colDef.cellFilter || colDef.cellFormatter;
	self.field = colDef.field;
	self.aggLabelFilter = colDef.cellFilter || colDef.cellFormatter || colDef.aggLabelFilter || colDef.aggLabelFormatter;
	self._visible = ko.observable(window.kg.utils.isNullOrUndefined(colDef.visible) || colDef.visible);
	self.visible = ko.computed({
		read: function() {
			return self._visible();
		},
		write: function(val) {
			self.toggleVisible(val);
		}
	});
	if (config.enableSort) {
		self.sortable(window.kg.utils.isNullOrUndefined(colDef.sortable) || colDef.sortable);
	}
	if (config.enableResize) {
		self.resizable(window.kg.utils.isNullOrUndefined(colDef.resizable) || colDef.resizable);
	}
	self.sortDirection = ko.observable(undefined);
	self.sortingAlgorithm = colDef.sortFn;
	self.headerClass = ko.observable(colDef.headerClass);
	self.headerCellTemplate = colDef.headerCellTemplate || window.kg.defaultHeaderCellTemplate();
	self.cellTemplate = colDef.cellTemplate || window.kg.defaultCellTemplate();
	if (colDef.cellTemplate && !TEMPLATE_REGEXP.test(colDef.cellTemplate)) {
		self.cellTemplate = window.kg.utils.getTemplatePromise(colDef.cellTemplate);
	}
	if (colDef.headerCellTemplate && !TEMPLATE_REGEXP.test(colDef.headerCellTemplate)) {
		self.headerCellTemplate = window.kg.utils.getTemplatePromise(colDef.headerCellTemplate);
	}

	self.onClick = function() { return null; };

	if (colDef.onClick) {
		self.cellClass(self.cellClass() + ' kgClickable');
		self.onClick = function(row) {
			return function(column, event){
				colDef.onClick(row, column, event);
			};
		};
	}

	self.delegatedClick = function() { return null; };

	if (colDef.delegatedClick) {
		self.cellClass(self.cellClass() + ' kgClickable');
		self.delegatedClick = function(row) {
			return function(column, event){
				colDef.delegatedClick(row, column, event);
			};
		};
	}

	self.delegatedDblclick = function() { return null; };

	if (colDef.delegatedDblclick) {
		self.cellClass(self.cellClass() + ' kgClickable');
		self.delegatedDblclick = function(row) {
			return function(column, event){
				colDef.delegatedDblclick(row, column, event);
			};
		};
	}

	self.getProperty = function (row) {
		var ret;
		if (self.cellFilter) {
			ret = self.cellFilter(row.getProperty(self.field));
		} else {
			ret = row.getProperty(self.field);
		}
		return ret;
	};
	self.toggleVisible = function (val) {
		var v;
		if (window.kg.utils.isNullOrUndefined(val) || typeof val == "object") {
			v = !self._visible();
		} else {
			v = val;
		}
		self._visible(v);
		window.kg.domUtilityService.BuildStyles(grid);
	};

	self.showSortButtonUp = ko.computed(function () {
		return self.sortable ? self.sortDirection() === DESC : self.sortable;
	});
	self.showSortButtonDown = ko.computed(function () {
		return self.sortable ? self.sortDirection() === ASC : self.sortable;
	});
	self.noSortVisible = ko.computed(function () {
		return !self.sortDirection();
	});

	self.sort = function () {
		if (!self.sortable()) {
			return true; // column sorting is disabled, do nothing
		}
		var dir = self.sortDirection() === ASC ? DESC : ASC;
		self.sortDirection(dir);
		config.sortCallback(self, dir);
		return false;
	};
	self.gripClick = function (data, event) {
		event.stopPropagation();
		clicks++;  //count clicks
		if (clicks === 1) {
			timer = setTimeout(function () {
				//Here you can add a single click action.
				clicks = 0;  //after action performed, reset counter
			}, delay);
		} else {
			clearTimeout(timer);  //prevent single-click action
			config.resizeOnDataCallback(self);  //perform double-click action
			clicks = 0;  //after action performed, reset counter
		}
	};
	self.gripOnMouseDown = function (event) {
		event.stopPropagation();
		if (event.ctrlKey) {
			self.toggleVisible();
			window.kg.domUtilityService.BuildStyles(grid);
			grid.config.columnsChanged(grid.columns.peek());
			return true;
		}
		self.eventTarget = event.target.parentElement;
		self.eventTarget.style.cursor = 'col-resize';
		self.startMousePosition = event.clientX;
		self.origWidth = self.width;
		$(document).mousemove(self.onMouseMove);
		$(document).mouseup(self.gripOnMouseUp);
		return false;
	};
	self.onMouseMove = function (event) {
		event.stopPropagation();
		var diff = event.clientX - self.startMousePosition;
		var newWidth = diff + self.origWidth;
		self.width = (newWidth < self.minWidth ? self.minWidth : (newWidth > self.maxWidth ? self.maxWidth : newWidth));
		window.kg.domUtilityService.BuildStyles(grid);
		return false;
	};
	self.gripOnMouseUp = function (event) {
		event.stopPropagation();
		$(document).off('mousemove');
		$(document).off('mouseup');
		self.eventTarget.style.cursor = self.sortable() ? 'pointer' : 'default';
		self.eventTarget = undefined;
		grid.config.columnsChanged(grid.columns.peek());
		return false;
	};
};