/// <reference path="lib/knockout-latest.debug.js" />

(function () {

    var kg = {};

    var utils = (function () {
        var seedId = new Date().getTime();

        return {
            newId: function () {
                return seedId += 1;
            },

            extend: function (target, obj) {
                var len = arguments.length || 0;
                var targ, src, prop;

                len -= 1; // since the length of an array is always 1 more than the actual index of an object...

                //count backwards through the args array and extend each item until we end with the target
                while (len > 0) {
                    targ = arguments[len - 1];  //1
                    src = arguments[len];       //2

                    for (prop in src) {
                        if (src.hasOwnProperty(prop)) {

                            if (ko.isObservable(target[prop])) {
                                target[prop](src[prop]); //set it through the setter function
                            } else {
                                target[prop] = src[prop];
                            }
                        }
                    }
                    //decrement counter
                    len -= 1;
                }
                return targ;
            },

            matchExtend: function (target, src) {
                var prop;

                for (prop in target) {
                    if (target.hasOwnProperty(prop) && src.hasOwnProperty(prop)) {

                        if (ko.isObservable(target[prop])) {
                            target[prop](src[prop]); //set it through the setter function
                        } else {
                            target[prop] = src[prop];
                        }
                    }
                }

                return target;
            },

            each: function (obsArray, callBack) {
                var index = 0,
                    items = obsArray() || [],
                    max = items.length || 0,
                    currentItem;
                for (; index < max; index++) {
                    currentItem = items[index];
                    callBack(index, currentItem);
                }
            }

        };
    } ());


    var baseObj = function () {

        this.init = function (options) {
            utils.matchExtend(this, options);
        };
    };

    kg.Column = function (options) {

        this.init(options);
    };
    kg.Column.prototype = new baseObj();



    kg.KnockoutGrid = function (options) {
        var _this = this;

        this.startRow = ko.observable(0);
        this.endRow = ko.observable(200);

        this.itemSource = ko.observableArray([]);
        this.viewableItemSource = ko.dependentObservable(function () {
            return _this.itemSource.slice(_this.startRow(), _this.endRow());
        });

        this.init(options);
    };
    kg.KnockoutGrid.prototype = new baseObj();

    ko.bindingHandlers['koGrid'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()),
                newBindingContext,
                grid;

            grid = new kg.KnockoutGrid(options);

            var viewer = document.createElement('DIV');
            var container = document.createElement('DIV');

            container.id = 'rowHolder';

            viewer.setAttribute('data-bind', "foreach: viewableItemSource");
            container.style.height = "200px";
            container.style.width = "200px";
            container.style.overflow = "auto";

            var cell1 = document.createElement('DIV');
            cell1.setAttribute('data-bind', "text: Sku");
            cell1.style.styleFloat = "left";

            var cell2 = document.createElement('DIV');
            cell2.setAttribute('data-bind', "text: SeasonCode");

            viewer.appendChild(cell1);
            viewer.appendChild(cell2);

            container.appendChild(viewer);

            element.appendChild(container);

            var el = document.getElementById('rowHolder');

            //container.onscroll = onScroll;
            ko.utils.registerEventHandler(el, 'scroll', function (evt) {
                var sender = evt.target;
                var something = evt;
                console.log(evt);
            });

            newBindingContext = bindingContext.createChildContext(grid);

            return ko.bindingHandlers['with'].init(element, ko.bindingHandlers.koGrid.makeValueAccessor(grid), allBindingsAccessor, viewModel, newBindingContext);

        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()),
                grid = new kg.KnockoutGrid(options);
            var newBindingContext = bindingContext.createChildContext(grid);

            return ko.bindingHandlers['with'].update(element, ko.bindingHandlers.koGrid.makeValueAccessor(grid), allBindingsAccessor, viewModel, bindingContext);
        },
        'makeValueAccessor': function (grid) {
            return function () {
                return grid;
            };
        }
    }

    kg.utils = utils;
    window['kg'] = kg;

} (window.ko));
