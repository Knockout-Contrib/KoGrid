#KoGrid : A Knockout DataGrid#

By: Eric M. Barnard
License: MIT
---
##About##
__KoGrid__ came out of our need for a decent datagrid that was built for MVVM/Knockout-style development. It draws considerable inspiration and architecture from SlickGrid, but is still KO throughout.

##Disclaimer##
KoGrid is ALPHA currently
---
The sizzle:
```
<div data-bind="koGrid: { data: myObservableArray }"></div>

var vm = {
  myObservableArray: ko.observableArray([])
};

ko.applyBindings(vm);
```

##Want More?##

