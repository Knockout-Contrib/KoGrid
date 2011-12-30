var utils = {

    forEach: function (arr, action) {
        var len = arr.length,
            i = 0;
        for (; i < len; i++) {
            if (arr[i] !== undefined) {
                action(arr[i], i);
            }
        }
    },

    forIn: function (obj, action) {
        var prop;

        for (prop in obj) {
            if(obj.hasOwnProperty(prop)){
                action(obj[prop], prop);
            }
        }
    }
};

utils.newId = (function () {
    var seedId = new Date().getTime();

    return function () {
        return seedId += 1;
    };
} ());

kg.utils = utils;