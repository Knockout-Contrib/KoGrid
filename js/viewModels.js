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