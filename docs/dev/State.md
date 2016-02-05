# Application State

All state is managed by React Redux. As a result, there is a single store that contains the entire application's state,
but, various parts being managed separately.

```
store: {
    /* Left nav bar */
    nav: {
        hidden: true
    },

    /* App Bar title */
    title: 'Chaos Studio',

    /* The minimum configuration needed for searching for attractors */
    configuration: { ... },

    /* Configuration in the process of being edited */
    newConfiguration: { ... },

    /* The minimum amount of information needed to re-generate an attractor.
       When this value changes, it should trigger a reinitialization of renderer */
    snapshot: {
        map: ...,
        rng: ...,
        startingIteration: ...
    },

    /* Whether to show the intro search box, only true if first run (no cookies) */
    showIntro: true
}
```

```
actions:
    /* Synchronous actions */
    SHOW_NAV,               // hidden = false
    HIDE_NAV,               // hidden = true
    SET_TITLE,              // title = ...
    SET_CONFIGURATION,      // configuration = ...
    EDIT_CONFIGURATION,     // newConfiguration = configuration
    APPLY_CONFIGURATION,    // configuration = newConfiguration, newConfiguration = null
    REJECT_CONFIGURATION,   // newConfiguration = null

    /* Asynchronous actions */
    START_SEARCH,
    CANCEL_SEARCH
    SET_SNAPSHOT,           // snapshot = ..., push('/explore/:snapshot')
```