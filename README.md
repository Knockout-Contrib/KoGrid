#A koGrid Fork
This is a koGrid fork with several features and bugfixes:

 - Added grouped rows and aggregation
 - Add a footer row which will show totals for each column
 - Improve the naming of the group column
 - Support for sorting grouped grids
 - Create Expand/Collapse-all buttons
 - Improve speed of grouped grid, esp when expanding and collapsing rows
 - Add an amd module output to the build process
 - Add cell selection and improve row selection

To see the grid in action please see the [example page] (http://cwohlman.github.io/KoGrid/)

#koGrid : A Knockout DataGrid#

__Contributors:__

KoGrid Team:
* [Eric M. Barnard](https://github.com/ericmbarnard/koGrid) 
* [Tim Sweet](http://ornerydevelopment.blogspot.com/)
* [Jonathon Ricaurte](https://github.com/jonricaurte)
* [Alan Souza](https://github.com/alansouzati)

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

Dependencies: jQuery & Knockout
***
##About##
__koGrid__ is a direct knockout port of [ng-grid](http://angular-ui.github.com/ng-grid/) which was originally inspired by koGrid, which was inspired by SlickGrid. I know, right?

koGrid is in 2.1.1 release currently. 

Questions, Comments, Complaints? feel free to email us at kogridteam@gmail.com

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
Check out the [Getting Started](https://github.com/Knockout-Contrib/KoGrid/wiki/Getting-Started) and other [Docs](https://github.com/Knockout-Contrib/KoGrid/wiki)

##Examples##
http://knockout-contrib.github.io/KoGrid/#/examples
also check out the new [Custom Cell Template Library](https://github.com/Knockout-Contrib/KoGrid/wiki/Cell-Template-Library)
##Change Log##
* __2012-12-18__ - Adding columnsChanged callback (#171) and added fixes for issues #170, #167, #164, and #134.
* __2012-12-12__ - Merge ineedFat's awesome serach improvements. Removing gridservice and improving performance with templates. other bugfixes.
* __2012-12-03__ - various improvements and fixes to searching, bindings, resizing, and reordering. Ability to specify partial html file urls for templates.
* __2012-12-03__ - Version 2.0 BREAKING CHANGES. numerous enhancements, bugfixes and architectural changes. reduced code footprint by ~40%.
* __2012-08-30__ - Version 1.2 merging changes from skoGrid branch
* __2012-08-18__ - Adding new features, up/down arrows now control the selected item when multiselect is disabled. columnDefs are now observable so you can change the columns on the fly.
* __2012-08-16__ - Styles moved into CSS, minor bug fix for Row templates where cells wouldn't take null values (for instance, when you want to display an image instead of the value)
* __2012-03-07__ - Huge Row Rendering Perf improvements, Easier syntax for custom cell templates,  Allow Custom CSS Classes on Header and Data Cells, Allow toggling of Footer Visibility, Much better button iconography, enhanced default CSS styles, various other bug fixes
* __2012-04-10__ - Wildcard Filtering, better grid resizing during window resize events, better sorting, numerous bug-fixes
