# EventCreator

An EventCreator is a function, which takes provided arguments and returns an FSA-compliant event. An EventCreator is created with [createEvent](/api/createEvent.html).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Definition](#definition)
- [Usage](#usage)
  - [`getType()`](#gettype)
  - [`is()`](#is)
  - [`epic()`](#epic)
- [Type definitions](#type-definitions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition

```typescript
type EventCreator = {
  (...args: any[]): Event  
  getType(): string
  is(event: Event): boolean
  epic(fn: Epic): Epic
}
```

## Usage

### `getType()`

Returns the type of an event. You may need this value in case you want to create reducers on your own. Every EventCreator has its own unique type.

```js
const increment = createEvent('Descriptions can be same')
const decrement = createEvent('Descriptions can be same')

increment.getType() === decrement.getType() // false
increment().type === increment.getType() // true
```

### `is()`

Checks if provided event is of EventCreator's type.

```javascript
const increment = createEvent()

increment.is(increment()) // true

// Usage in epics
const epic = (event$) => event$.pipe(
  filter(increment.is)
  // other stuff
)
```

### `epic()`

Accepts an Epic and returns an Epic. Provides a filtered stream of events to incoming Epic.

```js
const increment = createEvent()

const epic = increment.epic(increment$ => /* other stuff */)
```

## Type definitions

* [`EventCreator*`](/types.html#eventcreator0)
* [`Event`](/types.html#event)
* [`Epic`](/types.html#epic)