import { createApp } from '../../core/createApp/createApp'
import { initDone } from '../../events/initDone'
import { loggerModule } from '../../helpers/testHelpers/loggerModule/loggerModule'
import { wait } from '../../helpers/testHelpers/wait/wait'
import { setError, setReady, setValue, submit } from '../formBase/events'
import { formBase } from '../formBase/formBase'
import { FormBaseConfig } from '../formBase/formBase.h'
import { asyncValidationEnd, asyncValidationStart, revalidate } from './events'
import { isValidatingSelector } from './selectors'
import { validate } from './validate'
import { ValidateConfig } from './validate.h'

describe('validate', () => {
  const getApp = (validateConfig: ValidateConfig<any>, formConfig?: FormBaseConfig<any>) =>
    createApp({
      modules: [formBase(formConfig), validate(validateConfig)]
    })

  const getAppWithLogger = (
    validateConfig: ValidateConfig<any>,
    formConfig?: FormBaseConfig<any>
  ) =>
    createApp({
      modules: [loggerModule, formBase(formConfig), validate(validateConfig)]
    })

  describe('validation calls', () => {
    it('should call validation functions on init', () => {
      const age = jest.fn()
      const name = jest.fn()
      const username = jest.fn()

      const app = getApp(
        {
          rules: {
            age,
            name,
            username
          }
        },
        {
          initialValues: {
            age: '18',
            name: 'John'
          }
        }
      )

      expect(age.mock.calls).toHaveLength(1)
      expect(age).toBeCalledWith('18', 'age', app.getState(), { onInit: true })

      expect(name.mock.calls).toHaveLength(1)
      expect(name).toBeCalledWith('John', 'name', app.getState(), { onInit: true })

      expect(username.mock.calls).toHaveLength(1)
      expect(username).toBeCalledWith(undefined, 'username', app.getState(), { onInit: true })
    })

    it('should not validate fields if validateOnInit is set to false', () => {
      const age = jest.fn()
      const name = jest.fn()
      const username = jest.fn()

      const app = getAppWithLogger({
        rules: {
          age,
          name,
          username
        },
        validateOnInit: false
      })

      expect(age).not.toBeCalled()
      expect(name).not.toBeCalled()
      expect(username).not.toBeCalled()
    })

    it('should call validation on value change', () => {
      const age = jest.fn()
      const name = jest.fn()
      const username = jest.fn()

      const app = getApp({
        rules: {
          age,
          name,
          username
        },
        validateOnInit: false
      })

      app.dispatch(
        setValue({
          age: '20',
          name: 'Ivan'
        })
      )

      expect(age.mock.calls).toHaveLength(1)
      expect(age).toBeCalledWith('20', 'age', app.getState(), { onChange: true })

      expect(name.mock.calls).toHaveLength(1)
      expect(name).toBeCalledWith('Ivan', 'name', app.getState(), { onChange: true })

      expect(username.mock.calls).toHaveLength(0)

      app.dispatch(
        setValue({
          age: '25'
        })
      )

      expect(age.mock.calls).toHaveLength(2)
      expect(age).toBeCalledWith('25', 'age', app.getState(), { onChange: true })

      expect(name.mock.calls).toHaveLength(1)
      expect(username.mock.calls).toHaveLength(0)
    })

    it('should call validation on forceValidation', () => {
      const age = jest.fn()
      const name = jest.fn()
      const username = jest.fn()

      const app = getApp(
        {
          rules: {
            age,
            name,
            username
          },
          validateOnInit: false
        },
        {
          initialValues: {
            age: '18',
            name: 'John'
          }
        }
      )

      expect(age).not.toBeCalled()
      expect(name).not.toBeCalled()
      expect(username).not.toBeCalled()

      app.dispatch(revalidate())

      expect(age.mock.calls).toHaveLength(1)
      expect(age).toBeCalledWith('18', 'age', app.getState(), { onRevalidate: true })

      expect(name.mock.calls).toHaveLength(1)
      expect(name).toBeCalledWith('John', 'name', app.getState(), { onRevalidate: true })

      expect(username.mock.calls).toHaveLength(1)
      expect(username).toBeCalledWith(undefined, 'username', app.getState(), { onRevalidate: true })
    })
  })

  describe('sync validation', () => {
    it('should accept strings as errors', () => {
      const app = getAppWithLogger({
        rules: {
          age(value) {
            if (!value) {
              return 'Required!'
            }
          }
        }
      })

      expect(app.getState().errors).toEqual({
        age: 'Required!'
      })

      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(
          setError({
            age: 'Required!'
          })
        )
      ])
    })

    it('should accept objects as errors', () => {
      const app = getAppWithLogger({
        rules: {
          age(value) {
            if (!value) {
              return {
                age: 'Hey!',
                name: 'Heeeey!'
              }
            }
          }
        }
      })

      expect(app.getState().errors).toEqual({
        age: 'Hey!',
        name: 'Heeeey!'
      })

      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(
          setError({
            age: 'Hey!',
            name: 'Heeeey!'
          })
        )
      ])
    })

    it('should handle sync exceptions', () => {
      const app = getAppWithLogger({
        rules: {
          age(value) {
            if (!value) {
              throw 'Heeeeeey!' // tslint:disable-line no-string-throw
            }
          },
          name(value) {
            if (!value) {
              throw 'Heeeeeeeeeeeey!' // tslint:disable-line no-string-throw
            }
          }
        }
      })

      expect(app.getState().errors).toEqual({
        age: 'Heeeeeey!',
        name: 'Heeeeeeeeeeeey!'
      })

      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(
          setError({
            age: 'Heeeeeey!'
          })
        ),
        expect.objectContaining(
          setError({
            name: 'Heeeeeeeeeeeey!'
          })
        )
      ])
    })
  })

  describe('async validation', () => {
    it('should dispatch asyncValidationStart, asyncValidationEnd and setReady events', async () => {
      const app = getAppWithLogger({
        rules: {
          async age(value) {
            if (!value) {
              return 'Required!'
            }
          }
        }
      })

      await wait(50)

      expect(app.getState().errors).toEqual({
        age: 'Required!'
      })

      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false })),
        expect.objectContaining(
          setError({
            age: 'Required!'
          })
        ),
        expect.objectContaining(asyncValidationEnd('age')),
        expect.objectContaining(setReady({ age: true }))
      ])
    })

    it('should handle rejections', async () => {
      const app = getAppWithLogger({
        rules: {
          async age(value) {
            if (!value) {
              throw 'Heeeeeey!' // tslint:disable-line no-string-throw
            }
          },
          async name(value) {
            if (!value) {
              return Promise.reject('Heeeeeeeeeeeey!')
            }
          }
        }
      })

      await wait(50)

      expect(app.getState().errors).toEqual({
        age: 'Heeeeeey!',
        name: 'Heeeeeeeeeeeey!'
      })

      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false })),
        expect.objectContaining(asyncValidationStart('name')),
        expect.objectContaining(setReady({ name: false })),
        expect.objectContaining(
          setError({
            age: 'Heeeeeey!'
          })
        ),
        expect.objectContaining(asyncValidationEnd('age')),
        expect.objectContaining(setReady({ age: true })),
        expect.objectContaining(
          setError({
            name: 'Heeeeeeeeeeeey!'
          })
        ),
        expect.objectContaining(asyncValidationEnd('name')),
        expect.objectContaining(setReady({ name: true }))
      ])
    })

    it('async validation events', async () => {
      const selector = isValidatingSelector()
      const app = getAppWithLogger({
        rules: {
          async age() {
            await wait(100)
            return 'test'
          }
        },
        validateOnInit: false
      })

      expect(selector(app.getState())).toEqual(false)

      app.dispatch(setValue({ age: 10 }))
      expect(selector(app.getState())).toEqual(true)

      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(setValue({ age: 10 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false }))
      ])

      expect(app.getState().ready).toEqual({
        age: false
      })

      expect(app.getState().validating).toEqual({
        age: true
      })

      await wait(50)
      app.dispatch(setValue({ age: 12 }))
      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(setValue({ age: 10 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false })),
        expect.objectContaining(setValue({ age: 12 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false }))
      ])

      await wait(50)
      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(setValue({ age: 10 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false })),
        expect.objectContaining(setValue({ age: 12 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false }))
      ])

      await wait(50)
      expect(app.getState().eventLog).toEqual([
        expect.objectContaining(initDone()),
        expect.objectContaining(setValue({ age: 10 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false })),
        expect.objectContaining(setValue({ age: 12 })),
        expect.objectContaining(asyncValidationStart('age')),
        expect.objectContaining(setReady({ age: false })),
        expect.objectContaining(
          setError({
            age: 'test'
          })
        ),
        expect.objectContaining(asyncValidationEnd('age')),
        expect.objectContaining(setReady({ age: true }))
      ])

      expect(app.getState().ready).toEqual({
        age: true
      })

      expect(app.getState().validating).toEqual({
        age: false
      })
      expect(selector(app.getState())).toEqual(false)
    })
  })

  describe('setting fields as touched', () => {
    it('should set fields as touched on submit', () => {
      const age = jest.fn()
      const name = jest.fn()
      const username = jest.fn()

      const app = getAppWithLogger({
        rules: {
          age,
          name,
          username
        }
      })

      app.dispatch(submit())

      expect(app.getState().touched).toEqual({
        age: true,
        name: true,
        username: true
      })
    })

    it('should not set fields as touched if setTouchedOnSubmit is set to false', () => {
      const age = jest.fn()
      const name = jest.fn()
      const username = jest.fn()

      const app = getAppWithLogger({
        rules: {
          age,
          name,
          username
        },
        setTouchedOnSubmit: false
      })

      app.dispatch(submit())

      expect(app.getState().touched).toEqual({})
    })
  })
})
