'use strict';

/* Controllers */
function gettingStartedVM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { data: self.myData };
}

function columnDefsVM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { 
		data: self.myData,
		columnDefs: [{field: 'name', displayName: 'Name'},{field: 'age', displayName: 'Age'}]
	};
}

function groupingHTML5VM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { 
        data: self.myData,
        showGroupPanel: true
    };
}

function groupingJQueryUIVM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { 
        data: self.myData,
        showGroupPanel: true,
		jqueryUIDraggable: true
    };
}

function stringCellTemplateVM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { 
        data: self.myData,
        columnDefs: [{field: 'name', displayName: 'Name'},
                    {field: 'age', displayName: 'Age', cellTemplate:'<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index()}, css: { green: $data.getProperty($parent) > 30 }, html: $data.getProperty($parent)"></div>'}]
    };
}

function fileReferencedCellTemplateVM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { 
        data: self.myData,
        columnDefs: [{field: 'name', displayName: 'Name'},
                    {field: 'age', displayName: 'Age', cellTemplate:'partials/exampleDefinitions/templates/cellTemplates/fileReferencedCellTemplate/cellTemplate.html'}]
    };
}

function rowTemplateVM() {
    var self = this;
    this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    this.gridOptions = { 
        data: self.myData,
        rowTemplate: '<div data-bind="foreach: $grid.visibleColumns, css: { green: getProperty(\'age\') > 30 }">' +
                          '<div data-bind="attr: { \'class\': cellClass() + \' kgCell col\' + $index() }, kgCell: $data"></div>'+
                      '</div>',
        columnDefs: [{field: 'name', displayName: 'Name'},
                    {field: 'age', displayName: 'Age'}]
    };
}

function pagingVm(){
    var self = this;
  
    this.myData = ko.observableArray([]);
  
    this.filterOptions = {
		filterText: ko.observable(""),
		useExternalFilter: true
	};
  
	this.pagingOptions = {
		pageSizes: ko.observableArray([250, 500, 1000]),
		pageSize: ko.observable(250),
		totalServerItems: ko.observable(0),
		currentPage: ko.observable(1)     
	};
  
	this.setPagingData = function(data, page, pageSize){	
		var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		self.myData(pagedData);
		self.pagingOptions.totalServerItems(data.length);
	};
  
	this.getPagedDataAsync = function (pageSize, page, searchText) {
		setTimeout(function () {
			var data;
			if (searchText) {
				var ft = searchText.toLowerCase();
				$.getJSON('jsonFiles/largeLoad.json', function (largeLoad) {		
					data = largeLoad.filter(function(item) {
						return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
					});
					self.setPagingData(data,page,pageSize);
				});            
			} else {
				$.getJSON('jsonFiles/largeLoad.json', function (largeLoad) {
					self.setPagingData(largeLoad,page,pageSize);
				});
			}
		}, 100);
	};
  
	self.filterOptions.filterText.subscribe(function (data) {
		self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
	});   

	self.pagingOptions.pageSizes.subscribe(function (data) {
		self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
	});
	self.pagingOptions.pageSize.subscribe(function (data) {
		self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
	});
	self.pagingOptions.totalServerItems.subscribe(function (data) {
		self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
	});
	self.pagingOptions.currentPage.subscribe(function (data) {
		self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
	});
  
	self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage());

	this.gridOptions = {
	    data: self.myData,
        enablePaging: true,
        pagingOptions: self.pagingOptions,
        filterOptions: self.filterOptions
	};	
};

function masterDetailsVm(){
    var self = this;
    this.mySelections = ko.observableArray([]);
    this.myData = ko.observableArray([{name: "Moroni", age: 50},
                                      {name: "Tiancum", age: 43},
                                      {name: "Jacob", age: 27},
                                      {name: "Nephi", age: 29},
                                      {name: "Enos", age: 34}]);
    this.gridOptions = { 
      data: self.myData,
      selectedItems: self.mySelections,
      multiSelect: false
    };
}