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
  fromESObservable: (observable: Observable<any>) => Stream,
  toESObservable: (stream: Stream) => Observable<any>
})
```
**Note: setObservableConfig() uses global state, and could break apps if used inside a package intended to be shared.**

### Example
```js
import { from } from 'rxjs'
import { setObservableConfig } from 'stapp'

setObservableConfig({
  // Converts a plain ES observable to an RxJS 5 observable
  fromESObservable: Rx.Observable.from
})
```

```javascript
import { from } from 'rxjs'
import { switchMap, filter } from 'rxjs/operators'

const module = {
  name: 'my module',
  epic: (event$) => event$.pipe( // `pipe` is the only non-standard method in `light-observable`
    from, // here we transform es observable to Rx observable
    filter(({ type }) => type === 'some event'),
    switchMap(({ payload }) => myEffect(payload))
  )
}
```
This is fine, but doing this many times may be too verbose, especially when there are many epics in a module.


## `setObservableConfig`
**Note: setObservableConfig() uses global state, and could break apps if used inside a package intended to be shared.**

## RxJS
`light-observable` stream can be used with RxJS easily. Just wrap it with `from`:
```javascript
import { from } from 'rxjs'
import { switchMap, filter } from 'rxjs/operators'

const module = {
  name: 'my module',
  epic: (event$) => event$.pipe( // `pipe` is the only non-standard method in `light-observable`
    from, // here we transform es observable to Rx observable
    filter(({ type }) => type === 'some event'),
    switchMap(({ payload }) => myEffect(payload))
  )
}
```
This is fine, but doing this many times may be too verbose, especially when there are many epics in a module. Since you have to pass only one epic, and you'll have use `combineEpics` anyway, why not to put all transforming logic there? Just import `combineEpics` from `stapp-rxjs` and you are ready to go. We plan to create same package for `most`.

```javascript
import { combineEpics } from 'stapp-rxjs'
import { switchMap, filter } from 'rxjs/operators'

const epicA = (event$) => event$.pipe(
  filter(({ type }) => type === 'some event'),
  switchMap(({ payload }) => myEffect(payload))
)
const epicB = (event$) => event$.pipe(
  filter(({ type }) => type === 'some other event'),
  switchMap(({ payload }) => myOtherEffect(payload))
) 

const module = {
  name: 'my module',
  epic: combineEpics([
    epicA, epicB
  ])
}

```

#### Notice on interoperability with RxJS 6
RxJS 6 doesn't use 'symbol-observable' polyfill. This may cause some weird issues with interop depending on the import order. It is recommended to install and import symbol-observable polyfill somewhere at the top of your JS bundle.

