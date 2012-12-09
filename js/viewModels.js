'use strict';

/* Controllers */
function gettingStartedVM() {
    var self = this;
    prettyPrint();
    self.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                     { name: "Tiancum", age: 43 },
                     { name: "Jacob", age: 27 },
                     { name: "Nephi", age: 29 },
                     { name: "Enos", age: 34 }]);
    self.gridOptions = { data: self.myData };
}