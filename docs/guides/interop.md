# Interoperability
Stapp uses a reactive approach to business logic handling. Observables, streams, and epics are the core parts of Stapp.

Since version 2.0.0 we decided to move from RxJS to our own incredibly light observable implementation. We believe that using RxJS imposes too many restrictions on Stapp end-users. RxJS is standard de-facto but is far not the only reactive library out the wild.

Since version 2.0.0 epics receive a stream of events and a stream of state changes based on `light-observable`, the standard implementation of the [Observable proposal](https://github.com/tc39/proposal-observable).

This means that those streams are fully compatible with any ECMAScript compatible reactive library, including **RxJS**, **most**, **kefir**, **bacon** and so on.

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

