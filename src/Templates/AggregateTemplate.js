/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>

kg.aggregateTemplate = function () {
    return '<div data-bind="click: row.toggleExpand(), style: { \'left\': row.offsetleft}, class="kgAggregate"><span class="kgAggregateText" data-bind="text: $data.label"></span><div data-bind="css: row.aggClass"></div></div>';
};