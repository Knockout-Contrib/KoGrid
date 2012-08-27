#sKoGrid : A Knockout DataGrid#

LAtest revisions By: Tim Sweet          http://ornerydevelopment.blogspot.com/

Original work done by: Eric M. Barnard  https://github.com/ericmbarnard/KoGrid

Bug Fixes by : Stephen Commisso         https://github.com/gdscommisso/KoGrid

Special Thanks: Robert Nyman            http://www.robertnyman.com (getElementsByAttribute)

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

Dependencies: jQuery & Knockout
***
##About##
__sKoGrid__ came out of our need for a decent datagrid that was built for MVVM/Knockout-style development. It draws considerable inspiration and architecture from SlickGrid, but is still KO throughout.

##BREAKING CHANGES IN LATEST VERSION##

There is no more "selectedItem" or "isMultiSelect" in the options. There is only the selectedItems observableArray. This simplified the internal logic and allows for the grid selection to behave like a proper grid. Now CTRL/Shift click will multi-select while the default click behavior is single selection. In your own ViewModel if you need a selected item i suggest using something like this:

```javascript
    var selectedItem = ko.computed(function () {
        return selectedItems().length == 1 ? selectedItems()[0] : undefined ;// or whatever logic you want to return (last index, always return first index, whatever.
    });
```

##Disclaimer##
This is a fork off the main project created by Eric M. Barnard 

KoGrid is ALPHA currently. We are going to be adding more features here in the very near future...
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

also check out the new [Custom Cell Template Library](https://github.com/ericmbarnard/KoGrid/wiki/Cell-Template-Library)
##Change Log##
* __2012-08-27__ - BREAKING CHANGES: "selectedItem" and "isMultiSelect" is now gone. Logic for selection is totally redone that enables shift/ctrl click selections with the default being a single item slection on regular click. This could break existing user implementations!
* __2012-08-18__ - Adding new features, up/down arrows now control the selected item when multiselect is disabled. columnDefs are now observable so you can change the columns on the fly.
* __2012-08-16__ - Styles moved into CSS, minor bug fix for Row templates where cells wouldn't take null values (for instance, when you want to display an image instead of the value)
* __2012-03-07__ - Huge Row Rendering Perf improvements, Easier syntax for custom cell templates,  Allow Custom CSS Classes on Header and Data Cells, Allow toggling of Footer Visibility, Much better button iconography, enhanced default CSS styles, various other bug fixes
* __2012-04-10__ - Wildcard Filtering, better grid resizing during window resize events, better sorting, numerous bug-fixes