<a name="1.4.0"></a>
## 1.4.0 (2018-06-28)

* build(typedoc): temporary disable typedoc generation ([5db9c86](https://github.com/TinkoffCreditSystems/stapp/commit/5db9c86))
* chore(package): add homepage and issue-tracker links ([18ff6d8](https://github.com/TinkoffCreditSystems/stapp/commit/18ff6d8))
* comments ([f0b8437](https://github.com/TinkoffCreditSystems/stapp/commit/f0b8437))
* createConsumer => createConsume ([c2f7524](https://github.com/TinkoffCreditSystems/stapp/commit/c2f7524))
* feat(react/create(Consumer,consume,Form,Field,Componets)): React bindings reworked ([0870587](https://github.com/TinkoffCreditSystems/stapp/commit/0870587))
* feat(react/createField): Add ability to provide custom state selector to Field ([0fb955b](https://github.com/TinkoffCreditSystems/stapp/commit/0fb955b))
* fix(react/createConsumer): Use WeakMap (instead of object) to store consumers ([5959e27](https://github.com/TinkoffCreditSystems/stapp/commit/5959e27))


### BREAKING CHANGE

* You must pass Consumer to 'createConsume', 'createForm', 'createField' instead of Stapp instance

<a name="1.3.1"></a>
## <small>1.3.1 (2018-06-20)</small>

* chore(docs): fix NPM link ([0d5fd0c](https://github.com/TinkoffCreditSystems/stapp/commit/0d5fd0c))
* chore(package): add changelog generation to the version script ([10a53a3](https://github.com/TinkoffCreditSystems/stapp/commit/10a53a3))
* feat: setValue reaction tweaks ([3da9bb5](https://github.com/TinkoffCreditSystems/stapp/commit/3da9bb5))
* chore(examples) update README.md ([65ca066](https://github.com/TinkoffCreditSystems/stapp/commit/65ca066))
* chore(examples) update README.md ([d9f0a85](https://github.com/TinkoffCreditSystems/stapp/commit/d9f0a85))
* Fix and update examples (#6) ([79f2e7f](https://github.com/TinkoffCreditSystems/stapp/commit/79f2e7f)), closes [#6](https://github.com/TinkoffCreditSystems/stapp/issues/6)
* Fix NPM link in the README (#9) ([7baac50](https://github.com/TinkoffCreditSystems/stapp/commit/7baac50)), closes [#9](https://github.com/TinkoffCreditSystems/stapp/issues/9)
* build: fix and update build process to work with travis-ci ([208f1b8](https://github.com/TinkoffCreditSystems/stapp/commit/208f1b8))

<a name="1.2.0"></a>
## 1.3.0 (2018-06-15)
Initial github release

<a name="1.2.0"></a>
## 1.2.0 (2018-05-18)
Features:
* Update `use` method of the `EffectCreator`

Docs:
* Add documentation on the `createEffect`.

<a name="1.1.0"></a>
## 1.1.0 (2018-04-28)
Features:
* Add loaders module
* Add validate module

Docs:
* Update documentation on the new modules.
* Update examples to use new modules.

Build:
* Add commitizen task.

<a name="1.0.0"></a>
## 1.0.0 (2018-04-19)
Initial release.
