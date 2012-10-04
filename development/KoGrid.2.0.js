/*
===============================================================================
    
    Description: 
===============================================================================
*/

(function () {

    // Namespace
    var kg = window.kg = {};

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
    kg.Row = kg.gridElement.extend(function () {

        this.cells = ko.observableArray([]);
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

        this.init = function(){
            var items = self.data();

            _rowColl = ko.utils.arrayMap(items, function (item) {
                return new kg.Row(item);
            });

            ko.utils.arrayForEach(_rowColl, function (row) {
                var div = document.createElement('DIV');
                this.$el[0].appendChild(div);

                ko.applyBindings(row, div);
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

            // make sure we call the 'init' method
            gridElement.init.call(gridElement);

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
                gridElement = ko.utils.unwrapObservable(valueAccessor());

            // allow the overrides to change the args if needed
            if (handlerOverrides && handlerOverrides.update) {
                handlerOverrides.update.apply(this, arguments);
            }

            // make sure we call the update function
            gridElement.update.call(gridElement);
        }
    };

    kg.defineBindingHandler = function (name, /* optional */ handlerOverrides) {
        return ko.bindingHandlers[name] = new CoreBindingHandler(name, handlerOverrides);
    };

    ko.bindingHandlers['koGrid'] = {

        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var
                gridOpts = ko.utils.unwrapObservable(valueAccessor()),
                grid = new Grid(gridOpts);

            $(element).data('__kg_grid__', grid);

            ko.applyBindingsToDescendants(grid, element);

            return { 'controlsDescendantBindings': true };
        },

        update: function (element, valueAccessor) {
            var
                grid = $(element).data('__kg_grid__');

            grid.update();
        }
    };

    kg.defineBindingHandler('kgRows');
}());
