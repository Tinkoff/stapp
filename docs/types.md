


#  stapp

## Index

### Type aliases

* [AsyncStorage](#asyncstorage)
* [BaseEventCreator](#baseeventcreator)
* [ConsumerProps](#consumerprops)
* [EffectCreator](#effectcreator)
* [EmptyEventCreator](#emptyeventcreator)
* [Epic](#epic)
* [Event](#event)
* [EventCreator0](#eventcreator0)
* [EventCreator1](#eventcreator1)
* [EventCreator2](#eventcreator2)
* [EventCreator3](#eventcreator3)
* [EventCreators](#eventcreators)
* [EventEpic](#eventepic)
* [EventHandler](#eventhandler)
* [EventHandlers](#eventhandlers)
* [FieldApi](#fieldapi)
* [FieldProps](#fieldprops)
* [FormApi](#formapi)
* [FormBaseConfig](#formbaseconfig)
* [FormBaseState](#formbasestate)
* [FormProps](#formprops)
* [LoadersState](#loadersstate)
* [Module](#module)
* [ModuleFactory](#modulefactory)
* [PayloadTransformer0](#payloadtransformer0)
* [PayloadTransformer1](#payloadtransformer1)
* [PayloadTransformer2](#payloadtransformer2)
* [PayloadTransformer3](#payloadtransformer3)
* [PersistConfig](#persistconfig)
* [Reducer](#reducer)
* [RenderProps](#renderprops)
* [Stapp](#stapp)
* [Transform](#transform)
* [ValidateConfig](#validateconfig)
* [ValidationFlags](#validationflags)
* [ValidationRule](#validationrule)
* [ValidationRules](#validationrules)
* [ValidationState](#validationstate)


### Variables

* [dangerouslyReplaceState](#dangerouslyreplacestate)
* [dangerouslyResetState](#dangerouslyresetstate)
* [epicEnd](#epicend)
* [loaderEnd](#loaderend)
* [loaderStart](#loaderstart)
* [loadersReducer](#loadersreducer)
* [resetForm](#resetform)
* [revalidate](#revalidate)
* [setActive](#setactive)
* [setError](#seterror)
* [setReady](#setready)
* [setSubmitting](#setsubmitting)
* [setTouched](#settouched)
* [setValue](#setvalue)
* [submit](#submit)


### Functions

* [combineEpics](#combineepics)
* [createApp](#createapp)
* [createConsume](#createconsume)
* [createConsumer](#createconsumer)
* [createEffect](#createeffect)
* [createEvent](#createevent)
* [createField](#createfield)
* [createForm](#createform)
* [createReducer](#createreducer)
* [fieldSelector](#fieldselector)
* [formBase](#formbase)
* [formSelector](#formselector)
* [getInitialState](#getinitialstate)
* [isDirtySelector](#isdirtyselector)
* [isLoadingSelector](#isloadingselector)
* [isPristineSelector](#ispristineselector)
* [isPromise](#ispromise)
* [isReadySelector](#isreadyselector)
* [isValidSelector](#isvalidselector)
* [isValidatingSelector](#isvalidatingselector)
* [loaders](#loaders)
* [logError](#logerror)
* [persist](#persist)
* [renderComponent](#rendercomponent)
* [select](#select)
* [selectArray](#selectarray)
* [toAsync](#toasync)
* [validate](#validate)
* [whenReady](#whenready)



---
# Type aliases



<a id="asyncstorage"></a>

###  AsyncStorage

**Τ AsyncStorage**:  *`object`* 



#### Type declaration



 getItem : function
► **getItem**(key: *`string`*): `Promise`.<`any`>






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| key | `string`   |  - |





**Returns:** `Promise`.<`any`>





 removeItem : function
► **removeItem**(key: *`string`*): `Promise`.<`any`>






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| key | `string`   |  - |





**Returns:** `Promise`.<`any`>





 setItem : function
► **setItem**(key: *`string`*, data: *`string`*): `Promise`.<`any`>






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| key | `string`   |  - |
| data | `string`   |  - |





**Returns:** `Promise`.<`any`>







___

<a id="baseeventcreator"></a>

###  BaseEventCreator

**Τ BaseEventCreator**:  *`object`* 



#### Type declaration



 epic : function
► **epic**State(fn: *[EventEpic](#eventepic)`Payload`, `Meta`, `State`*): [Epic](#epic)`State`






**Type parameters:**

#### State 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fn | [EventEpic](#eventepic)`Payload`, `Meta`, `State`   |  - |





**Returns:** [Epic](#epic)`State`





 getType : function
► **getType**(): `string`








**Returns:** `string`





 is : function
► **is**(event: *[Event](#event)`any`, `any`*): `boolean`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [Event](#event)`any`, `any`   |  - |





**Returns:** `boolean`







___


<a id="consumerprops"></a>

###  ConsumerProps

**Τ ConsumerProps**:  *`object`[RenderProps](#renderprops)`Result`* 




Type inferring will be available... someday Typings are still in... progress




___


<a id="effectcreator"></a>

###  EffectCreator

**Τ EffectCreator**:  *`object`* 



#### Type declaration
►(payload: *`Payload`*): `Observable`.<[Event](#event)`any`, `any`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| payload | `Payload`   |  - |





**Returns:** `Observable`.<[Event](#event)`any`, `any`>





 fail: [EventCreator1](#eventcreator1)`any`






 start: [EventCreator1](#eventcreator1)`Payload`






 success: [EventCreator1](#eventcreator1)`Result`





 getType : function
► **getType**(): `string`








**Returns:** `string`





 use : function
► **use**(effectFn: *`function`*): [EffectCreator](#effectcreator)`Payload`, `Result`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| effectFn | `function`   |  - |





**Returns:** [EffectCreator](#effectcreator)`Payload`, `Result`







___

<a id="emptyeventcreator"></a>

###  EmptyEventCreator

**Τ EmptyEventCreator**:  *[BaseEventCreator](#baseeventcreator)`void`, `void``function`* 






___

<a id="epic"></a>

###  Epic

**Τ Epic**:  *[EventEpic](#eventepic)`any`, `any`, `State`* 




Epic is a function, that must return an Observable. An observable may emit any value, but only valid events will be passed to dispatch.
*__param__*: Stream of events

*__param__*: Stream of state





___

<a id="event"></a>

###  Event

**Τ Event**:  *`object`* 



#### Type declaration




 error: `boolean`






 meta: `Meta`






 payload: `Payload`






 type: `string`







___

<a id="eventcreator0"></a>

###  EventCreator0

**Τ EventCreator0**:  *[BaseEventCreator](#baseeventcreator)`Payload`, `Meta``function`* 






___

<a id="eventcreator1"></a>

###  EventCreator1

**Τ EventCreator1**:  *[BaseEventCreator](#baseeventcreator)`Payload`, `Meta``function`* 






___

<a id="eventcreator2"></a>

###  EventCreator2

**Τ EventCreator2**:  *[BaseEventCreator](#baseeventcreator)`Payload`, `Meta``function`* 






___

<a id="eventcreator3"></a>

###  EventCreator3

**Τ EventCreator3**:  *[BaseEventCreator](#baseeventcreator)`Payload`, `Meta``function`* 






___

<a id="eventcreators"></a>

###  EventCreators

**Τ EventCreators**:  *`object`* 




An object with various event creators as values

#### Type declaration


[K: `string`]: [AnyEventCreator](#anyeventcreator)






___

<a id="eventepic"></a>

###  EventEpic

**Τ EventEpic**:  *`function`* 




### Example
*__param__*: Stream of events

*__param__*: Stream of state


#### Type declaration
►(event$: *`Observable`.<[Event](#event)`Payload`, `Meta`>*, state$: *`Observable`.<`State`>*): `Observable`.<`any`>



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event$ | `Observable`.<[Event](#event)`Payload`, `Meta`>   |  - |
| state$ | `Observable`.<`State`>   |  - |





**Returns:** `Observable`.<`any`>






___

<a id="eventhandler"></a>

###  EventHandler

**Τ EventHandler**:  *`function`* 




Event handler. Accepts current state, event payload and event meta. Should return new state.

#### Type declaration
►(state: *`State`*, payload: *`Payload`*, meta: *`Meta`*): `State`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | `State`   |  - |
| payload | `Payload`   |  - |
| meta | `Meta`   |  - |





**Returns:** `State`






___

<a id="eventhandlers"></a>

###  EventHandlers

**Τ EventHandlers**:  *`object`* 




An object with various event handlers as values

#### Type declaration





___

<a id="fieldapi"></a>

###  FieldApi

**Τ FieldApi**:  *`object`* 



#### Type declaration




 input: `object`








 name: `string`






 onBlur: `function`




►(event: *`SyntheticEvent`.<`any`>*): `void`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `SyntheticEvent`.<`any`>   |  - |





**Returns:** `void`






 onChange: `function`




►(event: *`SyntheticEvent`.<`any`>*): `void`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `SyntheticEvent`.<`any`>   |  - |





**Returns:** `void`






 onFocus: `function`




►(event: *`SyntheticEvent`.<`any`>*): `void`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `SyntheticEvent`.<`any`>   |  - |





**Returns:** `void`






 value: `string`







 meta: `object`








 active: `boolean`






 error: `any`






 touched: `boolean`








___

<a id="fieldprops"></a>

###  FieldProps

**Τ FieldProps**:  *[RenderProps](#renderprops)[FieldApi](#fieldapi)`object`* 






___

<a id="formapi"></a>

###  FormApi

**Τ FormApi**:  *`object`* 



#### Type declaration




 dirty: `boolean`






 handleSubmit: `function`




►(event: *`SyntheticEvent`.<`any`>*): `void`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `SyntheticEvent`.<`any`>   |  - |





**Returns:** `void`






 pristine: `boolean`






 ready: `boolean`






 valid: `boolean`







___

<a id="formbaseconfig"></a>

###  FormBaseConfig

**Τ FormBaseConfig**:  *`object`* 



#### Type declaration




«Optional»  initialValues: [FormValues]()







___

<a id="formbasestate"></a>

###  FormBaseState

**Τ FormBaseState**:  *`object`* 



#### Type declaration




 active: `keyof Values`⎮`null`






 dirty: `object`









 errors: `object`









 pristine: `boolean`






 ready: `object`









 touched: `object`









 values: `Values`







___

<a id="formprops"></a>

###  FormProps

**Τ FormProps**:  *[RenderProps](#renderprops)[FormApi](#formapi)* 






___

<a id="loadersstate"></a>

###  LoadersState

**Τ LoadersState**:  *`object`* 



#### Type declaration


[K: `string`]: `boolean`






___

<a id="module"></a>

###  Module

**Τ Module**:  *`object`* 




A module is a plain object that consists of several fields. The only required field is `name`. It will be used in development mode for debugging. *
*__see__*: [ModuleFactory](#modulefactory)


#### Type declaration




«Optional»  api: [Api]()






«Optional»  dependencies: `string`[]






«Optional»  epic: [Epic](#epic)`Partial`.<`Full`>






«Optional»  events: [Api]()






 name: `string`






«Optional»  reducers: `undefined`⎮`object`






«Optional»  state: `undefined`⎮`object`






«Optional»  waitFor: `Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>







___

<a id="modulefactory"></a>

###  ModuleFactory

**Τ ModuleFactory**:  *`function`* 




ModuleFactory is a function that must return a [Module](#module). It will be called with any extra dependencies passed to [createApp](#createapp).

#### Type declaration
►(extraArgument: *`Extra`*): [Module](#module)`Api`, `State`, `Full`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| extraArgument | `Extra`   |  - |





**Returns:** [Module](#module)`Api`, `State`, `Full`






___


<a id="payloadtransformer0"></a>

###  PayloadTransformer0

**Τ PayloadTransformer0**:  *`function`* 




#### Type declaration
►(): `Payload`





**Returns:** `Payload`






___

<a id="payloadtransformer1"></a>

###  PayloadTransformer1

**Τ PayloadTransformer1**:  *`function`* 




#### Type declaration
►(arg1: *`A1`*): `Payload`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| arg1 | `A1`   |  - |





**Returns:** `Payload`






___

<a id="payloadtransformer2"></a>

###  PayloadTransformer2

**Τ PayloadTransformer2**:  *`function`* 




#### Type declaration
►(arg1: *`A1`*, arg2: *`A2`*): `Payload`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| arg1 | `A1`   |  - |
| arg2 | `A2`   |  - |





**Returns:** `Payload`






___

<a id="payloadtransformer3"></a>

###  PayloadTransformer3

**Τ PayloadTransformer3**:  *`function`* 




#### Type declaration
►(arg1: *`A1`*, arg2: *`A2`*, arg3: *`A3`*): `Payload`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| arg1 | `A1`   |  - |
| arg2 | `A2`   |  - |
| arg3 | `A3`   |  - |





**Returns:** `Payload`






___

<a id="persistconfig"></a>

###  PersistConfig

**Τ PersistConfig**:  *`object`* 




Persist module config

#### Type declaration




«Optional»  blackList: `string`[]






 key: `string`






«Optional»  serialize: `undefined`⎮`true`⎮`false`






«Optional»  stateReconciler: `function`⎮`false`






 storage: [AsyncStorage](#asyncstorage)






«Optional»  throttle: `undefined`⎮`number`






«Optional»  timeout: `undefined`⎮`number`






«Optional»  transforms: [Transform](#transform)[]






«Optional»  whiteList: `string`[]







___

<a id="reducer"></a>

###  Reducer

**Τ Reducer**:  *`object`* 




Basically, a reducer is a function, that accepts a state and an event, and returns a new state. Stapp [createReducer](#createreducer) creates a reducer on steroids. See examples below.

#### Type declaration
►(state: *`State`*, event: *[Event](#event)`any`, `any`*): `State`




**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | `State`   |  Reducer's state |
| event | [Event](#event)`any`, `any`   |  Any event |





**Returns:** `State`
new state





 createEvents : function
► **createEvents**T(model: *`object`*): `object`






Creates an object of eventCreators from passed eventHandlers.


**Type parameters:**

#### T :  `string`

List of eventCreators names

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| model | `object`   |  Object of event handlers |





**Returns:** `object`





 has : function
► **has**(event: *[AnyEventCreator](#anyeventcreator)⎮`string`*): `boolean`






Checks if the reducer has a handler for provided event creator or event type.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)⎮`string`   |  Any event creator or a string representing event type |





**Returns:** `boolean`





 off : function
► **off**(event: *[AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*): [Reducer](#reducer)`State`






Detaches EventHandler from the reducer. Returns reducer.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Event creator, a string representing event type or an array of event creators or types |





**Returns:** [Reducer](#reducer)`State`
Same reducer






 on : function
► **on**Payload,Meta(event: *[AnyEventCreator](#anyeventcreator)`Payload`, `Meta`⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*, handler: *[EventHandler](#eventhandler)`State`, `Payload`, `Meta`*): [Reducer](#reducer)`State`






Attaches EventHandler to the reducer. Adding handlers of already existing event type will override previous handlers. Returns reducer.


**Type parameters:**

#### Payload 

Event payload

#### Meta 

Event meta data

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)`Payload`, `Meta`⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Event creator, a string representing event type or an array of event creators or types |
| handler | [EventHandler](#eventhandler)`State`, `Payload`, `Meta`   |  EventHandler |





**Returns:** [Reducer](#reducer)`State`
same reducer






 reset : function
► **reset**(event: *[AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*): [Reducer](#reducer)`State`






Assigns reset handler to provided event types. Reset handler always returns initialState.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Event creator, a string representing event type or an array of event creators or types |





**Returns:** [Reducer](#reducer)`State`
Same reducer








___

<a id="renderprops"></a>

###  RenderProps

**Τ RenderProps**:  *`object`* 



#### Type declaration




«Optional»  children: `undefined`⎮`function`






«Optional»  component: `ReactType`






«Optional»  render: `undefined`⎮`function`







___

<a id="stapp"></a>

###  Stapp

**Τ Stapp**:  *`object`* 




An app, created by [createApp](#createapp) is another core concept of Stapp. See README.md for details.

#### Type declaration




 api: `Api`






 dispatch: `function`




►(event: *`any`*): `any`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `any`   |  - |





**Returns:** `any`






 getState: `function`




►(): `State`





**Returns:** `State`






 name: `string`






 state$: `Observable`.<`State`>







___

<a id="transform"></a>

###  Transform

**Τ Transform**:  *`object`* 



#### Type declaration




«Optional»  config: [PersistConfig](#persistconfig)






 in: `function`




►(subState: *`any`*, key?: *`undefined`⎮`string`*, state?: *`any`*): `any`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| subState | `any`   |  - |
| key | `undefined`⎮`string`   |  - |
| state | `any`   |  - |





**Returns:** `any`






 out: `function`




►(subState: *`any`*, key?: *`undefined`⎮`string`*, state?: *`any`*): `any`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| subState | `any`   |  - |
| key | `undefined`⎮`string`   |  - |
| state | `any`   |  - |





**Returns:** `any`







___

<a id="validateconfig"></a>

###  ValidateConfig

**Τ ValidateConfig**:  *`object`* 



#### Type declaration




 rules: [ValidationRules](#validationrules)`State`






«Optional»  setTouchedOnSubmit: `undefined`⎮`true`⎮`false`






«Optional»  validateOnInit: `undefined`⎮`true`⎮`false`







___

<a id="validationflags"></a>

###  ValidationFlags

**Τ ValidationFlags**:  *`object`* 



#### Type declaration




«Optional»  onChange: `undefined`⎮`true`⎮`false`






«Optional»  onInit: `undefined`⎮`true`⎮`false`






«Optional»  onRevalidate: `undefined`⎮`true`⎮`false`







___

<a id="validationrule"></a>

###  ValidationRule

**Τ ValidationRule**:  *`function`* 



#### Type declaration
►(value: *`string`⎮`void`*, fieldName: *`string`*, state: *`State`*, flags: *[ValidationFlags](#validationflags)*): `any`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| value | `string`⎮`void`   |  - |
| fieldName | `string`   |  - |
| state | `State`   |  - |
| flags | [ValidationFlags](#validationflags)   |  - |





**Returns:** `any`






___

<a id="validationrules"></a>

###  ValidationRules

**Τ ValidationRules**:  *`object`* 



#### Type declaration


[K: `string`]: [ValidationRule](#validationrule)`State`






___

<a id="validationstate"></a>

###  ValidationState

**Τ ValidationState**:  *`object`* 



#### Type declaration




 validating: `object`






[K: `string`]: `boolean`







___


# Variables








<a id="dangerouslyreplacestate"></a>

### «Const» dangerouslyReplaceState

**●  dangerouslyReplaceState**:  *[EventCreator1](#eventcreator1)`any`*  =  createEvent<any>(
  `${APP_KEY}: Replace state`
)




Can be used to replace state completely




___


<a id="dangerouslyresetstate"></a>

### «Const» dangerouslyResetState

**●  dangerouslyResetState**:  *[EmptyEventCreator](#emptyeventcreator)*  =  createEvent(`${APP_KEY}: Reset state`)




Can be used to reinitialize state




___


<a id="epicend"></a>

### «Const» epicEnd

**●  epicEnd**:  *[EmptyEventCreator](#emptyeventcreator)*  =  createEvent(`${APP_KEY}: Epic enc`)




Event signaling about epic completing




___



<a id="loaderend"></a>

### «Const» loaderEnd

**●  loaderEnd**:  *`object``function`*  =  createEvent<string>(`${LOADERS}: Loading end`)






___

<a id="loaderstart"></a>

### «Const» loaderStart

**●  loaderStart**:  *`object``function`*  =  createEvent<string>(`${LOADERS}: Loading start`)






___

<a id="loadersreducer"></a>

### «Const» loadersReducer

**●  loadersReducer**:  *`object`*  =  createReducer<LoadersState>({})
  .on(
    loaderStart,
    (loadersState, name) =>
      loadersState[name]
        ? loadersState
        : {
            ...loadersState,
            [name]: true
          }
  )
  .on(
    loaderEnd,
    (loadersState, name) =>
      !loadersState[name]
        ? loadersState
        : {
            ...loadersState,
            [name]: false
          }
  )



#### Type declaration
►(state: *`State`*, event: *[Event](#event)`any`, `any`*): `State`




**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | `State`   |  Reducer's state |
| event | [Event](#event)`any`, `any`   |  Any event |





**Returns:** `State`
new state





 createEvents : function
► **createEvents**T(model: *`object`*): `object`






Creates an object of eventCreators from passed eventHandlers.


**Type parameters:**

#### T :  `string`

List of eventCreators names

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| model | `object`   |  Object of event handlers |





**Returns:** `object`





 has : function
► **has**(event: *[AnyEventCreator](#anyeventcreator)⎮`string`*): `boolean`






Checks if the reducer has a handler for provided event creator or event type.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)⎮`string`   |  Any event creator or a string representing event type |





**Returns:** `boolean`





 off : function
► **off**(event: *[AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*): [Reducer](#reducer)`State`






Detaches EventHandler from the reducer. Returns reducer.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Event creator, a string representing event type or an array of event creators or types |





**Returns:** [Reducer](#reducer)`State`
Same reducer






 on : function
► **on**Payload,Meta(event: *[AnyEventCreator](#anyeventcreator)`Payload`, `Meta`⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*, handler: *[EventHandler](#eventhandler)`State`, `Payload`, `Meta`*): [Reducer](#reducer)`State`






Attaches EventHandler to the reducer. Adding handlers of already existing event type will override previous handlers. Returns reducer.


**Type parameters:**

#### Payload 

Event payload

#### Meta 

Event meta data

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)`Payload`, `Meta`⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Event creator, a string representing event type or an array of event creators or types |
| handler | [EventHandler](#eventhandler)`State`, `Payload`, `Meta`   |  EventHandler |





**Returns:** [Reducer](#reducer)`State`
same reducer






 reset : function
► **reset**(event: *[AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*): [Reducer](#reducer)`State`






Assigns reset handler to provided event types. Reset handler always returns initialState.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [AnyEventCreator](#anyeventcreator)⎮`string`⎮`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Event creator, a string representing event type or an array of event creators or types |





**Returns:** [Reducer](#reducer)`State`
Same reducer








___




<a id="resetform"></a>

### «Const» resetForm

**●  resetForm**:  *`object``function`*  =  createEvent(`${FORM_BASE}: Reset form state`)




Used to reset form state




___

<a id="revalidate"></a>

### «Const» revalidate

**●  revalidate**:  *`object``function`*  =  createEvent(`${VALIDATE}: force validation`)




Start revalidating all fields




___


<a id="setactive"></a>

### «Const» setActive

**●  setActive**:  *`object``function`*  =  createEvent<string | null>(`${FORM_BASE}: Set field as active`)




Set field as active




___

<a id="seterror"></a>

### «Const» setError

**●  setError**:  *`object``function`*  =  createEvent<{ [K: string]: any }>(`${FORM_BASE}: Set field error`)




Used to set errors for fields




___

<a id="setready"></a>

### «Const» setReady

**●  setReady**:  *`object``function`*  =  createEvent<{ [K: string]: boolean }>(`${FORM_BASE}: Set readiness`)




Used to set readiness state




___

<a id="setsubmitting"></a>

### «Const» setSubmitting

**●  setSubmitting**:  *`object``function`*  =  createEvent<boolean>(`${FORM_BASE}: Set submitting`)






___

<a id="settouched"></a>

### «Const» setTouched

**●  setTouched**:  *`object``function`*  =  createEvent<{ [K: string]: boolean }>(
  `${FORM_BASE}: Set field as touched`
)




Used to set field as touched




___

<a id="setvalue"></a>

### «Const» setValue

**●  setValue**:  *`object``function`*  =  createEvent<{ [K: string]: any }>(`${FORM_BASE}: Set field value`)




Used to set values for fields




___

<a id="submit"></a>

### «Const» submit

**●  submit**:  *`object``function`*  =  createEvent(`${FORM_BASE}: Submit`, () => undefined)




Used to indicate form submission




___



# Functions






<a id="combineepics"></a>

### «Const» combineEpics

► **combineEpics**S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,State(epics: *[[Epic](#epic)`S1`,[Epic](#epic)`S2`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`,[Epic](#epic)`S8`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`,[Epic](#epic)`S8`,[Epic](#epic)`S9`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`,[Epic](#epic)`S8`,[Epic](#epic)`S9`,[Epic](#epic)`S10`]*): [Epic](#epic)`State`






Combines epics into one


**Type parameters:**

#### S1 
#### S2 
#### S3 
#### S4 
#### S5 
#### S6 
#### S7 
#### S8 
#### S9 
#### S10 
#### State 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| epics | [[Epic](#epic)`S1`,[Epic](#epic)`S2`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`,[Epic](#epic)`S8`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`,[Epic](#epic)`S8`,[Epic](#epic)`S9`]⎮[[Epic](#epic)`S1`,[Epic](#epic)`S2`,[Epic](#epic)`S3`,[Epic](#epic)`S4`,[Epic](#epic)`S5`,[Epic](#epic)`S6`,[Epic](#epic)`S7`,[Epic](#epic)`S8`,[Epic](#epic)`S9`,[Epic](#epic)`S10`]   |  An array of epics to combine |





**Returns:** [Epic](#epic)`State`







___



<a id="createapp"></a>

### «Const» createApp

► **createApp**Api,State,Extra(config: *`object`*): [Stapp](#stapp)`State`, `Api`






Creates an application and returns a [Stapp](#stapp).


**Type parameters:**

#### Api 
#### State 
#### Extra 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| config | `object`   |  createApp config |





**Returns:** [Stapp](#stapp)`State`, `Api`





___


<a id="createconsume"></a>

### «Const» createConsume

► **createConsume**State,Api(app: *[Stapp](#stapp)`State`, `Api`*): `ConsumerHoc`.<`State`>,.<`Api`>






Creates higher order component, that passes state and api from a Stapp application to a wrapped component


**Type parameters:**

#### State 
#### Api 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| app | [Stapp](#stapp)`State`, `Api`   |  - |





**Returns:** `ConsumerHoc`.<`State`>,.<`Api`>





___

<a id="createconsumer"></a>

### «Const» createConsumer

► **createConsumer**State,Api(app: *[Stapp](#stapp)`State`, `Api`*): `ComponentClass`.<[ConsumerProps](#consumerprops)`State`, `Api`, `any`, `any`, `any`>






Creates Consumer component


**Type parameters:**

#### State 
#### Api 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| app | [Stapp](#stapp)`State`, `Api`   |  - |





**Returns:** `ComponentClass`.<[ConsumerProps](#consumerprops)`State`, `Api`, `any`, `any`, `any`>





___

<a id="createeffect"></a>

### «Const» createEffect

► **createEffect**Payload,Result(description: *`string`*, effect?: *`undefined`⎮`function`*, condition?: *`function`*): [EffectCreator](#effectcreator)`Payload`, `Result`






Creates an effect creator. Effect is a stream, that uses provided function, and emits start, success, error and complete types.

### Usage in epic example

     const payEffect = createEffect('Perform payment', pay)
    
     const payEpic = (event$, state$) => state$.pipe(
       sample(select(submit, event$)),
       switchMap(state => payEffect(state.values))
     )
    

### Usage as an api method

    ({ api }) => <Button onClick={api.payEffect} />


**Type parameters:**

#### Payload 
#### Result 
**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| description | `string`  | - |   - |
| effect | `undefined`⎮`function`  | - |   Side effect performing function, should return a Promise. |
| condition | `function`  |  T |   Function, that defines if an effect should run. Must return boolean. T by default. E.g. can be used to separate server-side effects. |





**Returns:** [EffectCreator](#effectcreator)`Payload`, `Result`







___

<a id="createevent"></a>

###  createEvent

► **createEvent**(description?: *`undefined`⎮`string`*): [EmptyEventCreator](#emptyeventcreator)

► **createEvent**Payload(description?: *`undefined`⎮`string`*): [EventCreator1](#eventcreator1)`Payload`, `Payload`

► **createEvent**Payload,Meta(description: *`string`*, payloadCreator: *[PayloadTransformer0](#payloadtransformer0)`Payload`*, metaCreator?: *[PayloadTransformer0](#payloadtransformer0)`Meta`*): [EventCreator0](#eventcreator0)`Payload`, `Meta`

► **createEvent**A1,Payload,Meta(description: *`string`*, payloadCreator: *[PayloadTransformer1](#payloadtransformer1)`A1`, `Payload`*, metaCreator?: *[PayloadTransformer1](#payloadtransformer1)`A1`, `Meta`*): [EventCreator1](#eventcreator1)`A1`, `Payload`, `Meta`

► **createEvent**A1,A2,Payload,Meta(description: *`string`*, payloadCreator: *[PayloadTransformer2](#payloadtransformer2)`A1`, `A2`, `Payload`*, metaCreator?: *[PayloadTransformer2](#payloadtransformer2)`A1`, `A2`, `Meta`*): [EventCreator2](#eventcreator2)`A1`, `A2`, `Payload`, `Meta`

► **createEvent**A1,A2,A3,Payload,Meta(description: *`string`*, payloadCreator: *[PayloadTransformer3](#payloadtransformer3)`A1`, `A2`, `A3`, `Payload`*, metaCreator?: *[PayloadTransformer3](#payloadtransformer3)`A1`, `A2`, `A3`, `Meta`*): [EventCreator3](#eventcreator3)`A1`, `A2`, `A3`, `Payload`, `Meta`






Creates an event creator that accepts no arguments ([EmptyEventCreator](#emptyeventcreator)). Description is optional.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| description | `undefined`⎮`string`   |  Event description |





**Returns:** [EmptyEventCreator](#emptyeventcreator)






Creates an event creator, that accepts single argument and passes it to an event as a payload ([EventCreator1](#eventcreator1)). Description is optional.
*__typeparam__*: Type of event meta



**Type parameters:**

#### Payload 

Type of event creator argument (and payload)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| description | `undefined`⎮`string`   |  Event description |





**Returns:** [EventCreator1](#eventcreator1)`Payload`, `Payload`






Creates an event creator that accepts no arguments ([EventCreator0](#eventcreator0)).


**Type parameters:**

#### Payload 

Type of event payload

#### Meta 

Type of event meta

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| description | `string`   |  Event description |
| payloadCreator | [PayloadTransformer0](#payloadtransformer0)`Payload`   |  Optional payload creator |
| metaCreator | [PayloadTransformer0](#payloadtransformer0)`Meta`   |  Optional meta creator |





**Returns:** [EventCreator0](#eventcreator0)`Payload`, `Meta`






Creates an event creator that accepts and transforms single argument ([EventCreator1](#eventcreator1)).


**Type parameters:**

#### A1 

Type of event creator argument

#### Payload 

Type of event payload

#### Meta 

Type of event meta

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| description | `string`   |  Event description |
| payloadCreator | [PayloadTransformer1](#payloadtransformer1)`A1`, `Payload`   |  Payload creator |
| metaCreator | [PayloadTransformer1](#payloadtransformer1)`A1`, `Meta`   |  Optional meta creator |





**Returns:** [EventCreator1](#eventcreator1)`A1`, `Payload`, `Meta`






Creates an event creator that accepts and transforms two arguments ([EventCreator2](#eventcreator2)).


**Type parameters:**

#### A1 

Type of event creator first argument

#### A2 

Type of event creator second argument

#### Payload 

Type of event payload

#### Meta 

Type of event meta

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| description | `string`   |  Event description |
| payloadCreator | [PayloadTransformer2](#payloadtransformer2)`A1`, `A2`, `Payload`   |  Payload creator |
| metaCreator | [PayloadTransformer2](#payloadtransformer2)`A1`, `A2`, `Meta`   |  Optional meta creator |





**Returns:** [EventCreator2](#eventcreator2)`A1`, `A2`, `Payload`, `Meta`






Creates an event creator that accepts and transforms three arguments ([EventCreator2](#eventcreator2)).


**Type parameters:**

#### A1 

Type of event creator first argument

#### A2 

Type of event creator second argument

#### A3 

Type of event creator third argument

#### Payload 

Type of event payload

#### Meta 

Type of event meta

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| description | `string`   |  Event description |
| payloadCreator | [PayloadTransformer3](#payloadtransformer3)`A1`, `A2`, `A3`, `Payload`   |  Payload creator |
| metaCreator | [PayloadTransformer3](#payloadtransformer3)`A1`, `A2`, `A3`, `Meta`   |  Optional meta creator |





**Returns:** [EventCreator3](#eventcreator3)`A1`, `A2`, `A3`, `Payload`, `Meta`





___

<a id="createfield"></a>

### «Const» createField

► **createField**State,Api(app: *[Stapp](#stapp)`State`, `Api`*): `StatelessComponent`.<[FieldProps](#fieldprops)>






Creates react form helpers

Form example
------------

     import { createForm } from 'stapp/lib/react'
     import someApp from '../myApps/app.js'
    
     const { Form, Field } = createForm(someApp)
    
     <Form>
       {
         ({
           handleSubmit,
           isReady,
           isValid
         }) => <form onSubmit={ handleSubmit }>
           <Field name='name'>
             {
               ({ input, meta }) => <React.Fragment>
                 <input { ...input} />
                 { meta.touched && meta.error && <span>{ meta.error }</span> }
               </React.Fragment>
             }
           </Field>
           <button
             type='submit'
             disabled={!isReady || !isValid}
            >
             Submit
            </button>
         </form>
       }
     </Form>
    

See more examples in the examples folder.


**Type parameters:**

#### State 
#### Api 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| app | [Stapp](#stapp)`State`, `Api`   |  Stapp application |





**Returns:** `StatelessComponent`.<[FieldProps](#fieldprops)>





___

<a id="createform"></a>

### «Const» createForm

► **createForm**State,Api(app: *[Stapp](#stapp)`State`, `Api`*): `StatelessComponent`.<[FormProps](#formprops)>






Creates react form helpers

Form example
------------

     import { createForm } from 'stapp/lib/react'
     import someApp from '../myApps/app.js'
    
     const { Form, Field } = createForm(someApp)
    
     <Form>
       {
         ({
           handleSubmit,
           isReady,
           isValid
         }) => <form onSubmit={ handleSubmit }>
           <Field name='name'>
             {
               ({ input, meta }) => <React.Fragment>
                 <input { ...input} />
                 { meta.touched && meta.error && <span>{ meta.error }</span> }
               </React.Fragment>
             }
           </Field>
           <button
             type='submit'
             disabled={!isReady || !isValid}
            >
             Submit
            </button>
         </form>
       }
     </Form>
    

See more examples in the examples folder.


**Type parameters:**

#### State 
#### Api 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| app | [Stapp](#stapp)`State`, `Api`   |  Stapp application |





**Returns:** `StatelessComponent`.<[FormProps](#formprops)>





___


<a id="createreducer"></a>

### «Const» createReducer

► **createReducer**S(initialState: *`S`*, handlers?: *[EventHandlers](#eventhandlers)`S`, `any`*): [Reducer](#reducer)`S`






Creates reducer with some additional methods


**Type parameters:**

#### S 

Reducer's state interface

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| initialState | `S`  | - |   Initial state for the reducer |
| handlers | [EventHandlers](#eventhandlers)`S`, `any`  |  {} |   Object with event types as keys and EventHandlers as values |





**Returns:** [Reducer](#reducer)`S`







___







<a id="fieldselector"></a>

### «Const» fieldSelector

► **fieldSelector**(name: *`string`*): `function`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string`   |  - |





**Returns:** `function`





___

<a id="formbase"></a>

### «Const» formBase

► **formBase**FormValues,ReadyKeys(config?: *[FormBaseConfig](#formbaseconfig)`FormValues`*): [Module](#module)`__type`, [FormBaseState](#formbasestate)`FormValues`, `ReadyKeys`






Base form module


**Type parameters:**

#### FormValues 

Application state shape

#### ReadyKeys :  `string`

List of fields used for readiness reducer

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| config | [FormBaseConfig](#formbaseconfig)`FormValues`  |  {} |   - |





**Returns:** [Module](#module)`__type`, [FormBaseState](#formbasestate)`FormValues`, `ReadyKeys`





___

<a id="formselector"></a>

### «Const» formSelector

► **formSelector**(): `function`








**Returns:** `function`





___






<a id="getinitialstate"></a>

### «Const» getInitialState

► **getInitialState**(reducer: *[Reducer](#reducer)`any`*): `any`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| reducer | [Reducer](#reducer)`any`   |  - |





**Returns:** `any`





___






<a id="isdirtyselector"></a>

### «Const» isDirtySelector

► **isDirtySelector**(): `function``object`








**Returns:** `function``object`





___



<a id="isloadingselector"></a>

### «Const» isLoadingSelector

► **isLoadingSelector**(): `function``object`








**Returns:** `function``object`





___

<a id="ispristineselector"></a>

### «Const» isPristineSelector

► **isPristineSelector**(): `(Anonymous function)`








**Returns:** `(Anonymous function)`





___

<a id="ispromise"></a>

### «Const» isPromise

► **isPromise**(maybePromise: *`any`*): `boolean`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| maybePromise | `any`   |  - |





**Returns:** `boolean`





___

<a id="isreadyselector"></a>

### «Const» isReadySelector

► **isReadySelector**(): `function``object`








**Returns:** `function``object`





___

<a id="isvalidselector"></a>

### «Const» isValidSelector

► **isValidSelector**(): `function``object`








**Returns:** `function``object`





___

<a id="isvalidatingselector"></a>

### «Const» isValidatingSelector

► **isValidatingSelector**(): `function``object`








**Returns:** `function``object`





___

<a id="loaders"></a>

### «Const» loaders

► **loaders**(): [Module](#module)`__type`, `object`








**Returns:** [Module](#module)`__type`, `object`





___

<a id="logerror"></a>

### «Const» logError

► **logError**(nameSpace: *`string`*, error: *`any`*): `void`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| nameSpace | `string`   |  - |
| error | `any`   |  - |





**Returns:** `void`





___







<a id="persist"></a>

### «Const» persist

► **persist**State(__namedParameters: *`object`*): [Module](#module)`object`, `__type`






Persistence module.


**Type parameters:**

#### State 

Application state shape

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| __namedParameters | `object`   |  - |





**Returns:** [Module](#module)`object`, `__type`
Module






___


<a id="rendercomponent"></a>

### «Const» renderComponent

► **renderComponent**(props: *[RenderProps](#renderprops)`any`*, passedProps: *`any`*, name: *`string`*): `ReactElement`.<`any`>⎮`null`






**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| props | [RenderProps](#renderprops)`any`   |  - |
| passedProps | `any`   |  - |
| name | `string`   |  - |





**Returns:** `ReactElement`.<`any`>⎮`null`





___



<a id="select"></a>

###  select

► **select**Payload,Meta(eventCreator: *`string`⎮[AnyEventCreator](#anyeventcreator)`Payload`, `Meta`*, source$: *`Observable`.<[Event](#event)`any`, `any`>*): `Observable`.<[Event](#event)`Payload`, `Meta`>






Filters stream of events by type of provided event creator


**Type parameters:**

#### Payload 

Event payload

#### Meta 

Event meta data

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventCreator | `string`⎮[AnyEventCreator](#anyeventcreator)`Payload`, `Meta`   |  Any event creator |
| source$ | `Observable`.<[Event](#event)`any`, `any`>   |  Stream of events |





**Returns:** `Observable`.<[Event](#event)`Payload`, `Meta`>
filtered stream of provided event type






___

<a id="selectarray"></a>

###  selectArray

► **selectArray**(eventCreators: *`Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>*, source$: *`Observable`.<[Event](#event)`any`, `any`>*): `Observable`.<[Event](#event)`any`, `any`>






Filters stream of events by provided event types


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventCreators | `Array`.<[AnyEventCreator](#anyeventcreator)⎮`string`>   |  Array of any event creators and/or strings representing event types |
| source$ | `Observable`.<[Event](#event)`any`, `any`>   |  Stream of events |





**Returns:** `Observable`.<[Event](#event)`any`, `any`>
filtered stream of provided event types






___

<a id="toasync"></a>

### «Const» toAsync

► **toAsync**(storage: *`object`*): [AsyncStorage](#asyncstorage)






Converts synchronous storage into asynchronous


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| storage | `object`   |  any localStorage or sessionStorage compatible object |





**Returns:** [AsyncStorage](#asyncstorage)







___



<a id="validate"></a>

### «Const» validate

► **validate**State(__namedParameters: *`object`*): [Module](#module)`__type`, `object`






**Type parameters:**

#### State :  [FormBaseState](#formbasestate)
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| __namedParameters | `object`   |  - |





**Returns:** [Module](#module)`__type`, `object`





___


<a id="whenready"></a>

### «Const» whenReady

► **whenReady**(): `Promise`.<`object`>






Returns promise, that resolves when all stores are ready. Primarily used for SSR.




**Returns:** `Promise`.<`object`>





___



