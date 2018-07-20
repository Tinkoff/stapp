# Stapp

[![Build Status](https://travis-ci.org/TinkoffCreditSystems/stapp.svg?branch=master)](https://travis-ci.org/TinkoffCreditSystems/stapp) [![Written in typescript](https://img.shields.io/badge/written_in-typescript-blue.svg)](https://www.typescriptlang.org/) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/) [![npm](https://img.shields.io/npm/v/stapp.svg)](https://www.npmjs.com/package/stapp)

Stapp is the highly opinionated application state-management tool based on redux with significantly reduced boilerplate. The primary goal of Stapp is to provide an easy way to create simple, robust and reusable applications.

Stapp comprises all the best practices and provides instruments to write understandable and predictable code.

Stapp includes:

* tools for creating reactive applications
* full compatibility with redux tooling
* SSR support
* bunch of drop-in modules which handle common scenarios:
  * `stapp-formbase`
  * `stapp-validate`
  * `stapp-persist`
  * `stapp-loaders`
  * `stapp-routing` (in progress)
* React utilities (`stapp-react`):
  * a higher order component and a render-prop component to connect to the state
  * form and field components

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Introduction](#introduction)
- [Stapp core concepts](#stapp-core-concepts)
- [Quick start](#quick-start)
- [Modules](#modules)
- [Peer dependencies](#peer-dependencies)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install stapp
# or
yarn add stapp
```

## Introduction

Here are some obvious statements:

1. Small applications are easier to develop and maintain.
2. Small blocks of business logic are easier to develop and maintain.
3. Applications tend to become larger and harder to develop and maintain.

Solution: separating applications into small and independent microapps.

That's what Stapp for.

## Stapp core concepts

1. The application consists of several logical blocks, or "microapps";
2. Microapp has its state and provides an API to change that state.
3. Small blocks, called modules handle microapp state and logic.
4. Modules are shape-agnostic, knows little to nothing about an app or other modules.
5. Each module processes one task and nothing more.
6. Microapps can run autonomously and independently from each other.

## Quick start

Here is a classic counter example:

```javascript
// counterModule.js
import { createReducer, createEvent } from 'stapp'

/*
  First, we create an events creators. As stated,
  event creators create events. Modules can react
  to events with reducers  (used to change state)
  and epics (used to dispatch other events asynchronously).

  And yes, event creators are just action creators
  with some additional helpers.
*/
const increase = createEvent('Increase')
const decrease = createEvent('Decrease')

/*
  Classical reducer with additional helpers.
  No string literal types. Ever.
*/
const counterReducer = createReducer(0)
  .on(increase, (state) => state + 1)
  .on(decrease, (state) => state - 1)

/*
  Here is the module itself. This particular
  module exposes only state and API. The application will
  use provided state and bind provided event creators to
  the application API.
*/
export const counterModule = {
  name: 'counter',
  state: {
    counter: counterReducer
  },
  api: {
    increase,
    decrease
  }
}

// app.js
import { createApp } from 'stapp'
import { counter } from './counterModule'

/*
  And, finally, the application itself. CreateApp utilizes
  provided modules to create an application state and
  to build an application API and exposes state$ and api
  properties.
*/
const app = createApp({
  modules: [counter]
})

app // app itself is compatible with standard observables
  .subscribe(state => console.log(`State: ${state}`))
// State: { counter: 0 }

app
  .api // api is a set of provided event creators binded to the state
  .increase()
// State: { counter: 1 }

app
  .api
  .decrease()
// State: { counter: 0 }

// And hey, don't forget to check the redux devtools!
```

So, a microapp in Stapp terminology is an object, that has only a few fields: `state$`, which is an observable state of an app, and an `api`, which comprises methods to change the state.

## Modules

CreateApp itself doesn't do much work. It sets up a redux store, a couple of middlewares and returns a Stapp object. Without modules, application api will be empty, and its state will be a plain empty object. Like, forever.

So, what are the modules? A module is a place where all your magic should happen. A module has an ability to:

1. create and handle portions of an app state;
2. provide methods to a public application api;
3. react to state changes;
4. react to api calls.

A basic module is an object or a function, returning an object. You've already seen the basic example of a module. You may find other examples [in the docs](usage/modules.md).

Stapp comes shipped with a few modules covering most common problems (see Modules section in the docs).

## Peer dependencies

Stapp core package is peer dependent on redux. Other `stapp-*` packages have their own peer dependencies.

## License

```
Copyright 2018 Tinkoff Bank

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
