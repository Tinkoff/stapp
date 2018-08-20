# Epics

Epic is a function that receives a stream of events and returns a stream of events. Although Stapp uses its mechanism to support epics, it has much in common with [redux-observable](https://redux-observable.js.org/docs/basics/Epics.html) and [redux-most](https://github.com/joshburgess/redux-most/). We sincerely recommend following these links, if you are not familiar with the epics concept.

Epics allow harnessing async logic with ease.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type Epic<State> = (
  event$: Observable<Event<any, any>>,
  state$: Observable<State>,
  staticApi: {
    dispatch: Dispatch<State>
    getState(): State
  }
) => Subscribable<any> | void

```

## Usage

Take the following as an example: search field with autosuggest.

```js
import { createEffect, combineEpics, createEvent, createReducer } from 'stapp'
import { loaderStart, loaderEnd } from 'stapp-loaders'
import { debounceTime, mapTo, map, skipRepeats, switchMap } from 'light-observable/operators'

const saveResults = createEvent('Save search results')

// EffectCreator returns an observable of three types of events:
// `start`, `success` or `fail` and `complete`.
const searchEffect = createEffect(
  // Effect description
  'Load suggestions',

  // Effect function, must return a value or a promise
  searchValue => fetch(`api?search=${searchValue}`).then(r => r.json())
)

const searchModule = {
  name: 'search',
  state: {
    search: createReducer([])
      .on(saveResults, (_, results) => results)
  },
  epic: combineEpics([
    // Start loader on effect run
    searchEffect.start.epic(start$ => start$.pipe(
      mapTo(loaderStart('search'))
    )),

    // End loader on effect complete
    searchEffect.complete.epic(complete$ => complete$.pipe(
      mapTo(loaderEnd('search'))
    )),

    // Save results on success
    searchEffect.success.epic(success$ => success$.pipe(
      map(({ payload }) => saveResults(payload))
    )),

    // Search epic
    (_, state$) => state$.pipe(
      // track only one field changes
      map(state => state.values.search),

      // debounce and distinct value changes
      debounceTime(500),
      skipRepeats(),

      // switch to effect function
      switchMap(({ payload: searchValue }) => searchEffect(searchValue))
    )
  ])
}
```

Epics allow *reacting* to events and state changes *reactively*. That's fun!

### Filtering event stream by event type
#### `select()`
```typescript
type select = (eventCreatorOrType: AnyEventCreator | string) => (event: Event) => boolean
```

```js
import { createEvent, select } from 'stapp'
import { filter } from 'light-observable'

const myEvent = createEvent()

const epic = (events$) => events$.pipe(
  filter(select(myEvent))
)
```

#### `selectArray()`
```typescript
type selectArray = (eventCreators: Array<AnyEventCreator | string>) => (event: Event) => boolean
```

```js
import { createEvent, selectArray } from 'stapp'
import { filter } from 'light-observable'

const myEventA = createEvent()
const myEventB = createEvent()

const epic = (events$) => events$.pipe(
  filter(selectArray([myEventA, myEventB]))
)
```

#### `EventCreator.epic()`

Accepts an Epic and returns an Epic. Provides a filtered stream of events to incoming Epic.

```js
const myEvent = createEvent()

const epic = myEvent.epic(myEvent$ => /* other stuff */)
```


<!--
## Type definitions

* [`Epic`](/types.html#epic)
* [`EventEpic`](/types.html#eventepic)
* [`createEffect`](/types.html#createeffect)
-->
