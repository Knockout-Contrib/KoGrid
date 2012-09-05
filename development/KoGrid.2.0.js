﻿/*
===============================================================================
    
    Description: 
===============================================================================
*/

(function () {

    // Namespace
    var kg = window.kg = {};

    kg.i18n = {
        /* label names and values here */

    };

    // map of css classes to add to each element
    // we create a map here, so folks can configure this 
    // as needed (ie: jquery ui classes, etc...)
    kg.css = {
        grid: 'kgGrid',
        viewport: 'kgViewPort',
        row: 'kgRow'
    };
/*
===============================================================================
    Debug.js
        
    Description: Debugging logic for development
===============================================================================
    */
    // Debugging and Diagnostic info
    var DEBUG = kg.debug = true;

    function log(message) {
        if (DEBUG) {
            console.log(message);
        }
    }

    // for timing and seeding
    function now() {
        if (window.performance && window.performance.webkitNow) {
            //var perf = window.performance;
            //var fn = perf.now || perf.mozNow || perf.webkitNow || perf.msNow || perf.oNow;
            return window.performance.webkitNow();
        }

        return new Date().getTime();
    };

    // Diagnostic perf measuring
    function StopWatch() {
        this._start = 0;
        this._stop = 0;
    };

    $.extend(StopWatch.prototype, {
        
        start: function () {
            this._start = now();
        },

        stop: function () {
            this._stop = now();
        },

        ellapsed: function () {
            return this._stop - this._start;
        },

        reset: function () {
            this._start = 0; this._stop = 0;
        }
    });

/*
===============================================================================
    Plugins.js
        
    Description: Plugin logic for KoGrid
===============================================================================
*/
    kg.plugins = {}; // global plugins

    // Example plugin:
    kg.plugins['blah'] = {

        onGridInit: function (grid) { },
        onGridUpdate: function (grid) { },

        onRowInit: function (row) { },
        onRowUpdate: function (row) { },

        onCellInit: function (cell) { },
        onCellUpdate: function (cell) { }

    };

/*
===============================================================================
    GridElement.js
    
    Description: The Base Class for all KoGrid Elements (Row, Grid, Viewport, etc...)
===============================================================================
*/

    kg.gridElement = {};

    // prototype methods for Grid Elements
    kg.gridElement.fn = {

        init: function () { },
        update: function () { }
    };

    // inheritence function
    kg.gridElement.extend = function (SubCtor) {

        function GridElement() {
            var self = this;
            
            // eventing
            ko.subscribable.call(self);

            // instance members
            this.$el = null; // jquery element ref
            this.controlsDescendantBindings = false;

            // call new ctor
            SubCtor.apply(self, arguments);
        }

        // Rig up the prototype
        $.extend(GridElement.prototype, kg.gridElement.fn);

        return GridElement;
    };

/*
===============================================================================
    Cell.js
        
    Description: Row collection
===============================================================================
*/
    kg.Cell = kg.gridElement.extend(function () {

        this.data = ''; // could be observable or not
    });
/*
===============================================================================
    Row.js
        
    Description: Row
===============================================================================
*/
    kg.Row = kg.gridElement.extend(function (entity) {
        var
            self = this;

        this.entity = entity;
        this.cells = ko.observableArray([]);

        this.init = function () {

            var cell = new kg.Cell();
            cell.data = 'blah';
            
            // obviously we would want to still use templates
            cell.$el = $('<div data-bind="kgCell: $data"><span data-bind="text: $data.entity.Sku"></span></div>');

            self.$el.append(cell.$el);
        };
    });

/*
===============================================================================
    Rows.js
    
    Description: Row collection
===============================================================================
*/
    // TODO: much more optimization
    kg.Rows = kg.gridElement.extend(function ( data ) {
        var
            self = this,
            _rowColl = [];

        this.data = data; // observable array
        this.controlsDescendantBindings = true;

        this.init = function(){
            var items = self.data();

            _rowColl = ko.utils.arrayMap(items, function (item) {
                return new kg.Row(item);
            });

            ko.utils.arrayForEach(_rowColl, function (row) {
                row.$el = $('<div data-bind="kgRow: $data"></div>');

                self.$el.append(row.$el);

                ko.applyBindings(row, row.$el[0]);
            });
        };

    });

/*
===============================================================================
    Grid.js
    
    Description: The KoGrid root object
===============================================================================
*/
    var Grid = kg.gridElement.extend(function (options) {
        var 
            defaults = {

            };
        
        this.config = $.extend(defaults, options);

        this.rows = new kg.Rows(this.config.data);
    });

    kg.Grid = Grid;

/*
===============================================================================
    BindingHandler.js
   
    Description: Core BindingHandler logic
===============================================================================
*/
    // single core bindingHandler
    function CoreBindingHandler(name, /* optional */ handlerOverrides) {
        this.name = name;

        this.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var
                gridElement = ko.utils.unwrapObservable(valueAccessor()),
                sw = new StopWatch(),
                newBindingContext = bindingContext;
            
            sw.start();

            // allow the overrides to manipulate the arguments if needed
            if (handlerOverrides && handlerOverrides.init) {
                handlerOverrides.init.apply(this, arguments);
            }

            // assign the element
            gridElement.$el = $(element);

            // make sure we call the 'init' method and give it the correct context
            gridElement.init.apply(gridElement, arguments);

            if (gridElement.controlsDescendantBindings) {
                newBindingContext = bindingContext.createChildContext(gridElement);

                ko.applyBindingsToDescendants(newBindingContext, element);

                sw.stop();
                log("[" + name + "]BindingHandler.Init: " + sw.ellapsed());
                return { 'controlsDescendantBindings': true };
            }

            sw.stop();
            log("[" + name + "]BindingHandler.Init: " + sw.ellapsed());
        },

        this.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var
                sw = new StopWatch(),
                gridElement = ko.utils.unwrapObservable(valueAccessor());

            sw.start();

            // allow the overrides to change the args if needed
            if (handlerOverrides && handlerOverrides.update) {
                handlerOverrides.update.apply(this, arguments);
            }

            // make sure we call the update function
            gridElement.update.apply(gridElement, arguments);

            sw.stop();
            log("[" + name + "]BindingHandler.Update: " + sw.ellapsed());
        }
    };

    kg.defineBindingHandler = function (name, /* optional */ handlerOverrides) {
        return ko.bindingHandlers[name] = new CoreBindingHandler(name, handlerOverrides);
    };

    ko.bindingHandlers['koGrid'] = {

        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var
                sw = new StopWatch(),
                gridOpts = ko.utils.unwrapObservable(valueAccessor()),
                grid = null;

            // Track the timing
            sw.start();

            // initialize the grid
            grid = new Grid(gridOpts);

            // we have jQuery to store this with, so use it
            $(element).data('__kg_grid__', grid);

            ko.applyBindingsToDescendants(grid, element);

            sw.stop();
            log("[koGrid]BindingHandler.Init: " + sw.ellapsed());

            return { 'controlsDescendantBindings': true };
        },

        update: function (element, valueAccessor) {
            var
                sw = new StopWatch(),
                grid = $(element).data('__kg_grid__');

            sw.start();

            grid.update();

            sw.stop();
            log("[koGrid]BindingHandler.Update: " + sw.ellapsed());
        }
    };

    // declare each bindingHandler
    kg.defineBindingHandler('kgRows');
    kg.defineBindingHandler('kgRow');
    //kg.defineBindingHandler('kgCell');
}());
