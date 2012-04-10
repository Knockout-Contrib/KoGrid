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

##Examples##
* [Simple Example](http://ericmbarnard.github.com/KoGrid/examples/SimpleExample.html) : Shows the absolute bare-minimum needed to get up and running
* [Defined Columns Example](http://ericmbarnard.github.com/KoGrid/examples/DefinedColumns.html) : Shows a grid with columns defined
* [Complex Example with Server Side Paging, Filtering, Sorting](http://ericmbarnard.github.com/KoGrid/examples/Complex-Server-Side-Paging.html) : Shows an example that easily allows server-side paging, sorting, and filtering
* [Large Data Set](http://ericmbarnard.github.com/KoGrid/examples/LargeData.html) : 10000+ rows! Shows virtualized scrolling, sorting and filtering
* [Master-Details](http://ericmbarnard.github.com/KoGrid/examples/MasterDetails.html) : Shows an example of Master-Detail display (click on row to display details)
 
##Change Log##
* __2011-03-07__ - Huge Row Rendering Perf improvements, Easier syntax for custom cell templates,  Allow Custom CSS Classes on Header and Data Cells, Allow toggling of Footer Visibility, Much better button iconography, enhanced default CSS styles, various other bug fixes