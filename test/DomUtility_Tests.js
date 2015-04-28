(function() {
    'use strict';
    /*global QUnit,kg*/

    QUnit.module('DomUtility Tests', {
        afterEach: function() {
            ko.cleanNode(document.querySelector('#qunit-fixture'));
        }
    });

    QUnit.test('Container variables are assigned to grid instance', function(assert) {

        var fixture = createTestGrid({
            data: ko.observableArray([
                {col1: '1'}
            ])
        });

        var gridInstance = fixture.gridInstance;
        var gridElement = fixture.$gridElement[0];

        assert.equal(gridInstance.$root[0], gridElement.parentNode);
        assert.equal(gridInstance.$topPanel[0], gridElement.querySelector('.kgTopPanel'));
        assert.equal(gridInstance.$groupPanel[0], gridElement.querySelector('.kgGroupPanel'));
        assert.equal(gridInstance.$headerContainer[0], gridElement.querySelector('.kgHeaderContainer'));
        assert.equal(gridInstance.$headerScroller[0], gridElement.querySelector('.kgHeaderScroller'));
        assert.ok(gridInstance.$headers);
        assert.equal(gridInstance.$viewport[0], gridElement.querySelector('.kgViewport'));
        assert.equal(gridInstance.$canvas[0], gridElement.querySelector('.kgCanvas'));
        assert.equal(gridInstance.$footerPanel[0], gridElement.querySelector('.ngFooterPanel'));
    });

    QUnit.test('Stylesheet is generated and assigned to grid', function(assert) {

        var fixture = createTestGrid({
            data: ko.observableArray([
                {col1: '1'}
            ])
        });

        var gridInstance = fixture.gridInstance;

        assert.equal(jQuery('body > style[id="' + gridInstance.gridId + '"]').length, 1);
        assert.ok(gridInstance.$styleSheet);
    });

    QUnit.test('Measure ScrollBars Occurred', function(assert) {
        assert.ok(window.kg.domUtilityService.ScrollH <= 100);
        assert.ok(window.kg.domUtilityService.ScrollW <= 100);
    });


    function createTestGrid(config) {
        var $testElement = $('<div" data-bind="koGrid: gridOptions"></div>');
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
