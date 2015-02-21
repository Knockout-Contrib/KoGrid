(function() {
    'use strict';
    /*global QUnit,kg,ko*/

    var getSelectionData = function() {
        return ko.observableArray([
            {
                'Sku': ko.observable('C-2820164'),
                'Vendor': 'NEWB',
                'SeasonCode': '542',
                'Mfg_Id': ko.observable('573-9880954'),
                'UPC': '822860449228'
            },
            {
                'Sku': ko.observable('J-8555462'),
                'Vendor': 'NIKE',
                'SeasonCode': '3935',
                'Mfg_Id': ko.observable('780-8855467'),
                'UPC': '043208523549'
            },
            {
                'Sku': ko.observable('K-5312708'),
                'Vendor': 'REEB',
                'SeasonCode': '1293',
                'Mfg_Id': ko.observable('355-6906843'),
                'UPC': '229487568922'
            },
            {
                'Sku': ko.observable('W-4295255'),
                'Vendor': 'REEB',
                'SeasonCode': '6283',
                'Mfg_Id': ko.observable('861-4929378'),
                'UPC': '644134774391'
            }
        ]);
    };

    QUnit.module("Selection Tests");

    QUnit.test("Basic Selection Smoke Test", function(assert) {

        var data = getSelectionData();
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

        assert.ok(manager, 'Manager Instantiated!');
        assert.equals(manager.selectedItemCount(), 0, 'Defaults to no selected items!');
    });

    QUnit.test("Toggle Select-All is false with no items", function(assert) {

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

        assert.ok(manager, 'Manager Instantiated!');
        assert.equals(manager.selectedItemCount(), 0, 'Defaults to no selected items!');
        assert.ok(!manager.toggleSelectAll(), "Toggle Select All is False when no items are present");
    });

    QUnit.test("Toggle Select-All is false with only some items", function(assert) {

        var data = getSelectionData();
        var item = ko.observable();
        var items = ko.observableArray([]);
        var index = ko.observable(0);


        var manager = new kg.SelectionManager({
            isMultiSelect: true,
            selectedItem: item,
            selectedItems: items,
            selectedIndex: index,
            data: data,
            lastClickedRow: ko.observable()
        });

        var entity = data()[1];

        entity['__kg_selected__'] = ko.observable(true);
        var row = new kg.Row(entity, {
            selectWithCheckboxOnly: false,
            canSelectRows: true,
            selectedItems: ko.observableArray([])
        }, manager);
        manager.changeSelection(row, {shiftKey: false, ctrlKey: false});

        assert.ok(manager, 'Manager Instantiated!');
        assert.equals(manager.selectedItemCount(), 1, 'One item is correctly selected');
        assert.equals(manager.toggleSelectAll(), false, "Toggle Select-All is false with only some items");
    });

    QUnit.test("Toggle Select-All actually selects all", function(assert) {

        var data = getSelectionData();
        var item = ko.observable();
        var items = ko.observableArray([]);
        var index = ko.observable(0);

        var manager = new kg.SelectionManager({
            isMultiSelect: true,
            selectedItem: item,
            selectedItems: items,
            selectedIndex: index,
            data: data,
            lastClickedRow: ko.observable()
        });

        manager.toggleSelectAll(true);

        assert.equals(manager.selectedItemCount(), 4, 'All items are counted as selected');
        assert.equals(manager.toggleSelectAll(), true, "Toggle Select All indicates all items are selected");
    });

    QUnit.test("Toggle Select-All actually de-selects all", function(assert) {

        var data = getSelectionData();
        var item = ko.observable();
        var items = ko.observableArray([]);
        var index = ko.observable(0);

        var manager = new kg.SelectionManager({
            isMultiSelect: true,
            selectedItem: item,
            selectedItems: items,
            selectedIndex: index,
            data: data,
            lastClickedRow: ko.observable()
        });

        manager.toggleSelectAll(true);

        assert.equals(manager.selectedItemCount(), 4, 'All items are counted as selected');
        assert.equals(manager.toggleSelectAll(), true, "Toggle Select All indicates all items are selected");

        manager.toggleSelectAll(false);
        assert.equals(manager.selectedItemCount(), 0, 'No items are counted as selected');
        assert.equals(manager.toggleSelectAll(), false, "Toggle Select All indicates no items are selected");
    });

    QUnit.test("De-select some items, then select-all should re-select all", function(assert) {

        var data = getSelectionData();
        var item = ko.observable();
        var items = ko.observableArray([]);
        var index = ko.observable(0);

        var manager = new kg.SelectionManager({
            isMultiSelect: true,
            selectedItem: item,
            selectedItems: items,
            selectedIndex: index,
            data: data,
            lastClickedRow: ko.observable()
        });

        // select everything
        manager.toggleSelectAll(true);

        // de-select one item
        var entity = data()[1];
        entity.__kg_selected__(false);
        var row = new kg.Row(entity, {
            selectWithCheckboxOnly: false,
            canSelectRows: true,
            selectedItems: ko.observableArray([])
        }, manager);
        manager.changeSelection(row, {shiftKey: false, ctrlKey: false});

        // make sure that was handled correctly
        assert.equals(manager.selectedItemCount(), 3, 'Only 3 items are counted as selected');
        assert.equals(manager.toggleSelectAll(), false, "Toggle Select All indicates not all items are selected");

        // now re-select all
        manager.toggleSelectAll(true);

        assert.equals(manager.selectedItemCount(), 4, 'All items are counted as selected');
        assert.equals(manager.toggleSelectAll(), true, "Toggle Select All indicates all items are selected");
    });
})();
