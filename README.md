#KoGrid : A Knockout DataGrid#

By: Eric M. Barnard

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

Dependencies: jQuery & Knockout
***
##About##
__KoGrid__ came out of our need for a decent datagrid that was built for MVVM/Knockout-style development. It draws considerable inspiration and architecture from SlickGrid, but is still KO throughout.

##Disclaimer##
KoGrid is ALPHA currently... _BUT_ I might know a few organizations going live in production here soon...
***
_The sizzle_:

```html
<div data-bind="koGrid: { data: myObservableArray }"></div>
```
```javascript
var vm = {
  myObservableArray: ko.observableArray(/* array of any complex obects */)
};

ko.applyBindings(vm);
```

##Want More?##
Check out the [Getting Started](https://github.com/ericmbarnard/KoGrid/wiki/Getting-Started) and other [Docs](https://github.com/ericmbarnard/KoGrid/wiki)
