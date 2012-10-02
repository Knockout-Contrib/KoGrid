kg.utils = {

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
    },
    
    StringBuilder: function () {
        var strArr = [];
        
        this.append = function (str, data) {
            var len = arguments.length,
                intMatch = 0,
                strMatch = '{0}',
                i = 1;

            if (len > 1) { // they provided data
                while (i < len) {

                    //apparently string.replace only works on one match at a time
                    //so, loop through the string and hit all matches
                    while (str.indexOf(strMatch) !== -1) {
                        str = str.replace(strMatch, arguments[i]);
                    }
                    i++;
                    intMatch = i - 1;
                    strMatch = "{" + intMatch.toString() + "}";
                }
            }
            strArr.push(str);
        };

        this.toString = function () {
            var separator = arguments[0];
            if (separator !== null && separator !== undefined) {
                return strArr.join(separator);
            } else {
                return strArr.join("");
            }
        };
    },

    unwrapPropertyPath: function(field, row){
        var propPath = field.split('.');
        var tempProp = row.entity()[propPath[0]]; 

        for (var j = 1; j < propPath.length; j++){
            // entity could be observable or not...
            if (ko.isObservable(tempProp)){
                tempProp = ko.utils.unwrapObservable(tempProp);
            }
            tempProp = tempProp[propPath[j]];
        }
        return tempProp;
    },
    
    newId: (function () {
        var seedId = new Date().getTime();

        return function () {
            return seedId += 1;
        };
    })()
};

// we copy KO's ie detection here bc it isn't exported in the min versions of KO
// Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness) 
$.extend(kg.utils, {
    ieVersion: (function () {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        );
        return version > 4 ? version : undefined;
    })(),
    
    isIe6: (function(){ 
        return kg.utils.ieVersion === 6}
    )(),
    isIe7: (function(){ 
        return kg.utils.ieVersion === 7}
    )(),
    isIe: (function () { 
        return kg.utils.ieVersion !== undefined; 
    })()
});