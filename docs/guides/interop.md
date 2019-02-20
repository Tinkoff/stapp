# Interoperability

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Global config: `setObservableConfig()`](#global-config-setobservableconfig)
  - [Example](#example)
- [Local module config](#local-module-config)
- [Direct transformation](#direct-transformation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Stapp uses a reactive approach to business logic handling. Observables, streams, and epics are the core parts of Stapp.

Stapp uses RxJS as an observable library.

This means that those streams are fully compatible with any ECMAScript compatible reactive library, including, **most**, **kefir**, **bacon** and so on.

There are several ways to use these streams with a preferable reactive library.

## Global config: `setObservableConfig()`
```typescript
type setObservableConfig<Stream> = ({
  fromESObservable?: (observable: Observable<any>) => Stream,
  toESObservable?: (stream: Stream) => Observable<any>
})
```
**Note: setObservableConfig() uses global state, and could break apps if used inside a package intended to be shared.**

### Example
```js
import most from 'most'
import { setObservableConfig } from 'stapp'

setObservableConfig({
  // Converts a plain ES observable to an RxJS observable 
  // If you are using an Observable-compatible library, you won't have to setup toESObservable
  fromESObservable: most.from
})
```

## Local module config
Every module can expose its local observable configuration which takes precedence over the global config.

```javascript
import most from 'most'

const module = {
  name: 'my module',
  epic: (event$) => event$ // event$ here is a most stream
    .filter(({ type }) => type === 'some event')
    .map(({ payload }) => most.from(myEffect(payload)))
    .switchLatest(),
  observableConfig: { 
    fromESObservable: most.from
  }
}
```

## Direct transformation
Finally, streams can be transformed in place. If you want to make sure that your module ignores global observable configuration and receives the standard Observable stream, set `useGlobalObservableConfig` to `false`.

```javascript
import most from 'most'

const module = {
  name: 'my module',
  epic: (event$) => most.from(event$)
    .filter(({ type }) => type === 'some event')
    .map(({ payload }) => most.from(myEffect(payload)))
        .switchLatest(),
  useGlobalObservableConfig: false // This is necessary if you plan to publish your module elsewhere
}
```
