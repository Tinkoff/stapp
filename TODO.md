* Typings
  - Need help with Consumer and @consume typings.
  - Explain and expand generic type params in interfaces
  - Add comments for every 'any' type annotation
* Various
  - Add comments for all `tslint:disable`, mmm, comments
  - Make build and publish process fancier (np)
* Modules
  - Add a mechanism to bind selectors to an app.
  - Routing module
* Thoughts
  - Application lifecycle methods.
  - Delayed app initialization. 
  - Add ability to add and remove modules dynamically
    - replaceEpic + replaceReducer should do the work
    - should avoid reinitialization of old epics?
  - Add api provider that would not re-render on state updates
  - Publish examples to the codesandbox.
  - Add support for plugins
    - Base modules functionality should be reduced to events and state reducers
    - Every other modules functionality should be provided by plugins
      - Examples of plugins:
        - Sagas support
        - Epics support (one for rxjs, another for most js)
        - Selectors and whatever
        - Devtools
        - Custom middlewares
        - etc.
