 v2.0.0
 Major update has tho main goals:
 1. Significantly reduce bundle size
 2. Make stapp much less opinionated

- [x] Split project into several modules
  * developing:
    * monorepo
    * OR a github organization
    * OR completely separated repos
  * publishing:
    * npm organisation (@stapp/core, @stapp/epic, @stapp/react, @stapp/formbase, etc.)
    * OR separated packages (stapp-core, stapp-epic, stapp-react, stapp-formbase, etc.)
- [ ] Delayed app initialization and an application lifecycle
  * `.init()` method instead of `dependencies` field. Will dispatch an init event.
  * `.destroy()` method will unsubscribe all listeners (epics and watchers). Will dispatch a destroy event.
- [ ] Remove RxJS dependency
  * epics will receive observable-compatible sources
  * this will allow to create various adapters from any type of async listener to the epic
    * redux-observable connector
    * redux-most connector
    * redux-saga connector
- [ ] Meta chains
  * every event dispatched via module should have an additional field:
    * `@source`: name of a source module
- [ ] Rewrite and simplify createApp
  * primary goal: performance
- [ ] Add an alias for the `epic` field (`process`)
- [ ] Remove combineEpics. Instead, `process` field should accept an array of processors.
- [ ] Add support for generators in the dispatch method. Dispatch should be as universal as possible.

