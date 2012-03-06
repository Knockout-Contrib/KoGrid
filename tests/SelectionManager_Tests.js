/// <reference path="qunit/qunit.js" />
/// <reference path="../lib/jquery-1.7.js" />
/// <reference path="../lib/knockout-2.0.0.debug.js" />
/// <reference path="../koGrid.debug.js" />

kgTest.getSelectionData = function () {
    return ko.observableArray([
        { 'Sku': ko.observable('C-2820164'), 'Vendor': 'NEWB', 'SeasonCode': '542', 'Mfg_Id': ko.observable('573-9880954'), 'UPC': '822860449228' },
        { 'Sku': ko.observable('J-8555462'), 'Vendor': 'NIKE', 'SeasonCode': '3935', 'Mfg_Id': ko.observable('780-8855467'), 'UPC': '043208523549' },
        { 'Sku': ko.observable('K-5312708'), 'Vendor': 'REEB', 'SeasonCode': '1293', 'Mfg_Id': ko.observable('355-6906843'), 'UPC': '229487568922' },
        { 'Sku': ko.observable('W-4295255'), 'Vendor': 'REEB', 'SeasonCode': '6283', 'Mfg_Id': ko.observable('861-4929378'), 'UPC': '644134774391' }
    ]);
};




module("Selection Tests");

test("Basic Selection Smoke Test", function () {

    var data = kgTest.getSelectionData();
    var item = ko.observable();
    var items = ko.observableArray([]);
    var index = ko.observable(0);


    var manager = new kg.SelectionManager({
        isMultiSelect: true,
        selectedItem: item,
        selectedItems: items,
        selectedIndex: index,
        data: data
    });

    ok(manager, 'Manager Instantiated!');
    equals(manager.selectedItemCount(), 0, 'Defaults to no selected items!');
});

test("Toggle Select-All is false with no items", function () {

    var data = ko.observableArray([]);
    var item = ko.observable();
    var items = ko.observableArray([]);
    var index = ko.observable(0);


    var manager = new kg.SelectionManager({
        isMultiSelect: true,
        selectedItem: item,
        selectedItems: items,
        selectedIndex: index,
        data: data
    });

    ok(manager, 'Manager Instantiated!');
    equals(manager.selectedItemCount(), 0, 'Defaults to no selected items!');
    ok(!manager.toggleSelectAll(), "Toggle Select All is False when no items are present");
});

test("Toggle Select-All is true with some items", function () {

    var data = kgTest.getSelectionData();
    var item = ko.observable();
    var items = ko.observableArray([]);
    var index = ko.observable(0);


    var manager = new kg.SelectionManager({
        isMultiSelect: true,
        selectedItem: item,
        selectedItems: items,
        selectedIndex: index,
        data: data
    });

    ok(manager, 'Manager Instantiated!');
    equals(manager.selectedItemCount(), 0, 'Defaults to no selected items!');
    ok(!manager.toggleSelectAll(), "Toggle Select All is true when some items are present");
});