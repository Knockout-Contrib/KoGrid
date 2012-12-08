/// <reference path="../namespace.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
kg.AggregateProvider = function (grid) {
    var self = this;
    // The init method gets called during the ng-grid directive execution.
    self.colToMove = undefined;
	self.groupToMove = undefined;
    self.assignEvents = function () {
        // Here we set the onmousedown event handler to the header container.
		if(grid.config.jqueryUIDraggable){
			grid.$groupPanel.droppable({
				addClasses: false,
				drop: function(event) {
					self.onGroupDrop(event);
				}
			});
			$(document).ready(self.setDraggables);	
		} else {
			grid.$groupPanel.on('mousedown', self.onGroupMouseDown).on('dragover', self.dragOver).on('drop', self.onGroupDrop);
			grid.$headerScroller.on('mousedown', self.onHeaderMouseDown).on('dragover', self.dragOver).on('drop', self.onHeaderDrop);
			if (grid.config.enableRowReordering) {
				grid.$viewport.on('mousedown', self.onRowMouseDown).on('dragover', self.dragOver).on('drop', self.onRowDrop);
			}
			self.setDraggables();
		}
        grid.columns.subscribe(self.setDraggables);
    };
    self.dragOver = function(evt) {
        evt.preventDefault();
    };	
	
	//For JQueryUI
	self.setDraggables = function(){
		if(!grid.config.jqueryUIDraggable){	
			grid.$root.find('.kgHeaderSortColumn').attr('draggable', 'true').on('dragstart', self.onHeaderDragStart).on('dragend', self.onHeaderDragStop);
		} else {
			grid.$root.find('.kgHeaderSortColumn').draggable({
				helper: 'clone',
				appendTo: 'body',
				stack: 'div',
				addClasses: false,
				start: function(event){
					self.onHeaderMouseDown(event);
				}
			}).droppable({
				drop: function(event) {
					self.onHeaderDrop(event);
				}
			});
		}
	};
    
    self.onGroupDragStart = function () {
        // color the header so we know what we are moving
        if (self.groupToMove) {
            //self.groupToMove.header.css('background-color', 'rgb(255, 255, 204)');
        }
    };	
    
    self.onGroupDragStop = function () {
        // Set the column to move header color back to normal
        if (self.groupToMove) {
            //self.groupToMove.header.css('background-color', 'rgb(247,247,247)');
        }
    };

    self.onGroupMouseDown = function(event) {
        var groupItem = $(event.target);
        // Get the scope from the header container
		if(groupItem[0].className !='kgRemoveGroup'){
		    var groupItemScope = ko.dataFor(groupItem[0]);
			if (groupItemScope) {
				// set draggable events
				if(!grid.config.jqueryUIDraggable){
					groupItem.attr('draggable', 'true');
					groupItem.on('dragstart', self.onGroupDragStart).on('dragend', self.onGroupDragStop);
				}
				// Save the column for later.
				self.groupToMove = { header: groupItem, groupName: groupItemScope, index: groupItemScope.groupIndex() - 1 };
			}
		} else {
			self.groupToMove = undefined;
		}
    };

    self.onGroupDrop = function(event) {
        // clear out the colToMove object
        var groupContainer;
        var groupScope;
        if (self.groupToMove) {
			self.onGroupDragStop();
            // Get the closest header to where we dropped
            groupContainer = $(event.target).closest('.kgGroupElement'); // Get the scope from the header.
            if (groupContainer.context.className =='kgGroupPanel') {
                grid.configGroups.splice(self.groupToMove.index, 1);
                grid.configGroups.push(self.groupToMove.groupName);
            } else {
                groupScope = ko.dataFor(groupContainer[0]);
                if (groupScope) {
                    // If we have the same column, do nothing.
                    if (self.groupToMove.index != groupScope.$index){
						// Splice the columns
                        grid.configGroups.splice(self.groupToMove.index, 1);
                        grid.configGroups.splice(groupScope.$index(), 0, self.groupToMove.groupName);
					}
                }
            }			
			self.groupToMove = undefined;
			grid.fixGroupIndexes();
        } else {	
			self.onHeaderDragStop();
			if (grid.configGroups.indexOf(self.colToMove.col) == -1) {
                groupContainer = $(event.target).closest('.kgGroupElement'); // Get the scope from the header.
				if (groupContainer.context.className =='kgGroupPanel' || groupContainer.context.className =='kgGroupPanelDescription') {
				    grid.groupBy(self.colToMove.col);
				} else {
				    groupScope = ko.dataFor(groupContainer[0]);
				    if (groupScope) {
						// Splice the columns
				        grid.removeGroup(groupScope.$index());
					}
				}	
            }			
			self.colToMove = undefined;
        }
    };
	
    //Header functions
    self.onHeaderMouseDown = function (event) {
        // Get the closest header container from where we clicked.
        var headerContainer = $(event.target).closest('.kgHeaderSortColumn');
        if (!headerContainer[0]) return true;
        // Get the scope from the header container
        
        var headerScope = ko.dataFor(headerContainer[0]);
        if (headerScope) {
            // Save the column for later.
            self.colToMove = { header: headerContainer, col: headerScope };
        }
    };
    
    self.onHeaderDragStart = function () {
        // color the header so we know what we are moving
        if (self.colToMove) {
            self.colToMove.header.css('background-color', 'rgb(255, 255, 204)');
        }
    };
    
    self.onHeaderDragStop = function () {
        // Set the column to move header color back to normal
        if (self.colToMove) {
            self.colToMove.header.css('background-color', 'rgb(234, 234, 234)');
        }
    };

    self.onHeaderDrop = function (event) {
        if (!self.colToMove) return true;
        self.onHeaderDragStop();
        // Get the closest header to where we dropped
        var headerContainer = $(event.target).closest('.kgHeaderSortColumn');
        if (!headerContainer[0]) return true;
        // Get the scope from the header.
        var headerScope = ko.dataFor(headerContainer[0]);
        if (headerScope) {
            // If we have the same column, do nothing.
            if (self.colToMove.col == headerScope) return true;
            // Splice the columns
            var cols = grid.columns();
            cols.splice(self.colToMove.col.index, 1);
            cols.splice(headerScope.index, 0, self.colToMove.col);
            grid.columns(cols);
            // Finally, rebuild the CSS styles.
            kg.domUtilityService.BuildStyles(grid);
            // clear out the colToMove object
            self.colToMove = undefined;
        }
    };
    
    // Row functions
    self.onRowMouseDown = function (event) {
        // Get the closest row element from where we clicked.
        var targetRow = $(event.target).closest('.kgRow');
        // Get the scope from the row element
        var rowScope = ko.dataFor(targetRow[0]);
        if (rowScope) {
            // set draggable events
            targetRow.attr('draggable', 'true');
            // Save the row for later.
            kg.gridService.eventStorage.rowToMove = { targetRow: targetRow, scope: rowScope };
        }
    };

    self.onRowDrop = function (event) {
        // Get the closest row to where we dropped
        var targetRow = $(event.target).closest('.kgRow');
        // Get the scope from the row element.
        var rowScope = ko.dataFor(targetRow[0]);
        if (rowScope) {
            // If we have the same Row, do nothing.
            var prevRow = kg.gridService.eventStorage.rowToMove;
            if (prevRow.scope == rowScope) return;
            // Splice the Rows via the actual datasource
            var sd = grid.sortedData();
            var i = sd.indexOf(prevRow.scope.entity);
            var j = sd.indexOf(rowScope.entity);
            grid.sortedData.splice(i, 1);
            grid.sortedData.splice(j, 0, prevRow.scope.entity);
            grid.searchProvider.evalFilter();
            // clear out the rowToMove object
            kg.gridService.eventStorage.rowToMove = undefined;
            // if there isn't an apply already in progress lets start one
        }
    };
    // In this example we want to assign grid events.
    self.assignEvents();
};
