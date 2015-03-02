# KoGrid
A Knockout DataGrid


__Contributors:__

KoGrid Team:
* [Eric M. Barnard](https://github.com/ericmbarnard)
* [Tim Sweet](http://ornerydevelopment.blogspot.com/)
* [Jonathon Ricaurte](https://github.com/jonricaurte)
* [Alan Souza](https://github.com/alansouzati)

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

Dependencies: jQuery & Knockout
***
##About##
__KoGrid__ is a direct knockout port of [ng-grid](http://angular-ui.github.com/ng-grid/) which was originally inspired by KoGrid, which was inspired by SlickGrid. I know, right?

KoGrid is in 2.1.1 release currently.

Questions, Comments, Complaints? feel free to email us at kogridteam@gmail.com

***
_The sizzle_:

```html
<div data-bind="koGrid: { data: myObservableArray }"></div>
```
```javascript
var vm = {
  myObservableArray: ko.observableArray(/* array of any complex objects */)
};

ko.applyBindings(vm);
```

##Want More?##
Check out the [Getting Started](https://github.com/Knockout-Contrib/KoGrid/wiki/Getting-Started) and other [Docs](https://github.com/Knockout-Contrib/KoGrid/wiki).

##Examples##
http://knockout-contrib.github.io/KoGrid/#/examples

Also check out the new [Custom Cell Template Library](https://github.com/Knockout-Contrib/KoGrid/wiki/Cell-Template-Library).
