kg.ColumnCollection = function () {

    var obs = ko.observableArray([]);
    ko.utils.extend(obs, kg.ColumnCollection.fn);

    return obs;
};

kg.ColumnCollection.fn = {

};