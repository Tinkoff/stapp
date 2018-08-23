# Interoperability

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [RxJS](#rxjs)
    - [Notice on interoperability with RxJS 6](#notice-on-interoperability-with-rxjs-6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Stapp uses a reactive approach to business logic handling. Observables, streams, and epics are the core parts of Stapp. 

Observables in Stapp conform to the [Observable proposal](https://github.com/tc39/proposal-observable). See [`light-observable`](http://light-observable.js.org/) for more details.

This means that those streams are fully compatible with any ECMAScript compatible reactive library, including **RxJS**, **most**, **kefir**, **bacon** and so on.

There are several ways to use these streams with preferable reactive library.

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
import { from } from 'rxjs'
import { setObservableConfig } from 'stapp'

setObservableConfig({
  // Converts a plain ES observable to an RxJS observable
  fromESObservable: from
})
```

### Prepacked configurations
#### RxJS:
```js
import { setObservableConfig } from 'stapp'
import { observableConfig } from 'stapp-rxjs'

setObservableConfig(observableConfig)
```

#### Notice on interoperability with RxJS 6
RxJS 6 doesn't use 'symbol-observable' polyfill. This may cause some weird issues with interop depending on the import order. It is recommended to install and import symbol-observable polyfill somewhere at the top of your JS bundle.

## Local module config
Every module can expose it's local observable configuration which will take precedence over the global config.

```javascript
import { observableConfig } from 'stapp-rxjs'
import { switchMap, filter } from 'rxjs/operators'

const module = {
  name: 'my module',
  epic: (event$) => event$.pipe( // event$ here is an RxJS observable
    filter(({ type }) => type === 'some event'),
    switchMap(({ payload }) => myEffect(payload))
  ),
  observableConfig
}
```

## Direct transformation
```javascript
import { from } from 'rxjs'
import { switchMap, filter } from 'rxjs/operators'

const module = {
  name: 'my module',
  epic: (event$) => event$.pipe( // event$ here is a standard Observable having only one non-standard method, `pipe`.
    from, // <-- it's here!
    filter(({ type }) => type === 'some event'),
    switchMap(({ payload }) => myEffect(payload))
  ),
  observableConfig
}
```
