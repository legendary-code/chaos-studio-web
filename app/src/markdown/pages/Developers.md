#### Introduction
Looking to contribute some cool new map or perhaps a better random number
generator algorithm, or a cool new render visualization?  This is the
place for you!

#### Contributing
The source can be found here: [https://github.com/legendary-code/chaos-studio-web](https://github.com/legendary-code/chaos-studio-web)

If you wish to contribute, clone the repository, create a branch and make
your changes there.  Afterwards, push your branch up and create a pull
request:

```bash
git clone git@github.com:legendary-code/chaos-studio-web.git
cd chaos-studio-web
git checkout -B your_branch_name
git commit -am "Your changes commit message"
git push -u origin your_branch_name
```
 
I've severely slacked in writing tests, so, please, make sure
you test the new feature you implement by running it locally.

```bash
npm install
npm install -g gulp
gulp serve
```

#### Components
All the various functionality that's been implemented for things like
random number generators, maps, renderers, and so forth have been
implemented in an organized components API.  All components are
implemented in the latest version of JavaScript: ECMAScript 6.  The next
few sections will go over all the various component classes that can be
extended to implement new features.

##### Component
This is the base class for all components that can be implemented. When
implementing a new component, you'll almost never extend this class
directly, but instead, you'll be extending a subclass that is more
specific to the kind of component you wish to implement.  If you wish
to add a new map, you would extend the `Map` component.  

All components must implement at minimum, two static getters for the
`displayName` and `description` of the component, which will appear in
the settings dialog.  Components may also specify a static getter for
configuration `params` that can be configured in the settings dialog.

In order for a component to be usable, it must also be registered with
the `Components` helper class:

```js
var Map = require('../Map'),
    Props = require('../Props'),
    Components = require('../Components');

class MyAwesomeMap extends Map {
    // required
    static get displayName() {
        return "My Awesome Map";
    }

    // required
    static get description() {
        return "A map made of pure awesomeness";
    }
    
    // optional
    static get params() {
        return [
            Props.numberRange("Threshold", "min", "max", -1.0, 1.0, { decimalPlaces: 2 }),
            Props.number("Theta", "theta", 0.0, 1.0, { decimalPlaces: 2 })
        ];
    }

}

Components.register(Map, MyAwesomeMap, false);
module.exports = MyAwesomeMap;
```

Each base component type may have additional things that may need to be
implemented, which will be covered in their respective sections below.

