(function() {
    'use strict';
    /*global QUnit,kg*/

    QUnit.module('Column Initialization Tests', {
        afterEach: function() {
            ko.cleanNode(document.querySelector('#qunit-fixture'));
        }
    });

    QUnit.test('Should generate columns from model', function(assert) {

        var fixture = createTestGrid({
            data: ko.observableArray([
                { col1: '1' }
            ])
        });

        // Code assertions
        var columns = fixture.gridInstance.columns();
        assert.equal(columns.length, 2);
        assert.equal(columns[0].sortable(), false);
        assert.equal(columns[0].resizable(), false);
        assert.equal(columns[1].sortable(), true);
        assert.equal(columns[1].resizable(), true);

        // UI assertions
        var $headerItems = fixture.$gridElement.find('.kgHeaderContainer .kgHeaderCell');
        assert.equal($headerItems.length, 2);
        assert.ok($headerItems.find(':first-child > input:checkbox'));
    });

    QUnit.test('Should generate columns from configuration', function(assert) {

        var fixture = createTestGrid({
            data: ko.observableArray([
                { col1: '1', col2: '2', col3: '3', col4: '4' }
            ]),
            columnDefs: [
                {field: 'col2', displayName: 'Column #2'},
                {field: 'col4', displayName: 'Column #4'}
            ]
        });

        var columns = fixture.gridInstance.columns();
        assert.equal(columns.length, 3);

        // First column
        var column = columns[1];
        assert.equal(column.displayName(), 'Column #2');
        assert.equal(column.field, 'col2');

        column = columns[2];
        assert.equal(column.displayName(), 'Column #4');
        assert.equal(column.field, 'col4');
    });

    function createTestGrid(config) {
        var $testElement = $('<div data-bind="koGrid: gridOptions"></div>');
        $('#qunit-fixture').append($testElement);
        ko.applyBindings({ gridOptions: config }, $testElement[0]);

        var $gridElement = $testElement.children().first();
        var gridInstance = ko.dataFor($gridElement[0]);

        return {
            gridInstance: gridInstance,
            $gridElement: $gridElement
        };
    }
})();
