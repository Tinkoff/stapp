import React from 'react'
import { act, render, cleanup } from 'react-testing-library'
import { createApp, createEvent, createReducer } from 'stapp'
import { formBase, resetForm, submit } from 'stapp-formbase'
import { logger } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { Provider, useApi, useField, useForm, useStapp } from '../'
import { FieldApi, FormApi } from 'stapp-react'

describe('useApi', () => {
  const event = createEvent<any>()

  const demoModule = {
    name: 'demo',
    state: {
      r1: createReducer(0)
        .on(event, (_, payload) => payload)
        .reset(resetForm)
    },
    api: {
      event: jest.fn(event)
    }
  }
  const demoApp = createApp({
    modules: [
      logger({
        ignoreInternal: false
      }),
      demoModule,
      formBase({
        initialValues: {
          property: ''
        }
      })
    ]
  })

  afterEach(() => {
    cleanup()
    demoApp.dispatch(resetForm())
  })

  describe('useApi', () => {
    it('should provide api', () => {
      let api

      const Dummy = () => {
        api = useApi()
        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(api).toBe(demoApp.api)
    })
  })

  describe('useStapp', () => {
    it('should provide app state', () => {
      let state

      const Dummy = () => {
        ;[state] = useStapp()
        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(state).toBe(demoApp.getState())
    })

    it('should rerender on state updates', () => {
      const Dummy = () => {
        const [state] = useStapp()
        return <span>{state.r1}</span>
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      const { container, rerender } = render(<App />)
      const span = container.getElementsByTagName('span')[0]

      expect(span.textContent).toBe('0')

      act(() => {
        demoApp.api.event(1)
      })
      rerender(<App />)

      expect(span.textContent).toBe('1')
    })

    it('should accept selector', () => {
      const Dummy = () => {
        const [r1] = useStapp((state) => state.r1)
        return <span>{r1}</span>
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      const { container } = render(<App />)
      const span = container.getElementsByTagName('span')[0]

      expect(span.textContent).toBe('0')

      act(() => {
        demoApp.api.event(1)
      })

      expect(span.textContent).toBe('1')
    })

    it('should not rerender if selector returns same value', () => {
      let renders = 0
      const Dummy = () => {
        renders++
        const [test] = useStapp(() => ({ t: 1 }))
        return <span>{test.t}</span>
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(renders).toBe(1)

      act(() => {
        demoApp.api.event(1)
      })

      expect(renders).toBe(1)

      act(() => {
        demoApp.api.event(2)
      })

      expect(renders).toBe(1)
    })

    it('should provide api and the app itself', () => {
      let api
      let app

      const Dummy = () => {
        ;[, api, app] = useStapp()
        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(api).toBe(demoApp.api)
      expect(app).toBe(demoApp)
    })
  })

  describe('useForm', () => {
    it('should provide form state', () => {
      let formState: any

      const Dummy = () => {
        ;[formState] = useForm()

        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(formState!.dirty).toBe(false)
      expect(formState!.pristine).toBe(true)
      expect(formState!.ready).toBe(true)
      expect(formState!.submitting).toBe(false)
      expect(formState!.valid).toBe(true)

      expect(typeof formState!.handleReset).toBe('function')
      expect(typeof formState!.handleSubmit).toBe('function')
    })

    it('provides handleReset', () => {
      let formState: any

      const Dummy = () => {
        ;[formState] = useForm()

        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      act(() => {
        formState!.handleReset()
      })

      expect(demoApp.getState().logger.last).toEqual(
        expect.objectContaining(resetForm())
      )
    })

    it('provides handleSubmit', () => {
      let formState: FormApi
      const preventDefault = jest.fn()

      const Dummy = () => {
        ;[formState] = useForm()

        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      act(() => {
        formState!.handleSubmit()
      })

      expect(demoApp.getState().logger.last).toEqual(
        expect.objectContaining(submit())
      )

      act(() => {
        formState!.handleSubmit({
          preventDefault
        } as any)
      })

      expect(demoApp.getState().logger.last).toEqual(
        expect.objectContaining(submit())
      )
      expect(preventDefault).toBeCalled()
    })

    it('should provide api and the app itself', () => {
      let api
      let app

      const Dummy = () => {
        ;[, api, app] = useForm()
        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(api).toBe(demoApp.api)
      expect(app).toBe(demoApp)
    })
  })

  describe('useField', () => {
    it('should provide field state', () => {
      let fieldState: FieldApi

      const Dummy = () => {
        ;[fieldState] = useField('property')

        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(fieldState!.input.name).toBe('property')
      expect(fieldState!.input.value).toBe('')
      expect(fieldState!.meta.active).toBe(false)
      expect(fieldState!.meta.dirty).toBe(false)
      expect(fieldState!.meta.error).toBe(undefined)
      expect(fieldState!.meta.touched).toBe(false)

      expect(typeof fieldState!.input.onBlur).toBe('function')
      expect(typeof fieldState!.input.onChange).toBe('function')
      expect(typeof fieldState!.input.onFocus).toBe('function')
    })

    it('should provide onFocus and onBlur', () => {
      let input: FieldApi['input']
      let meta: FieldApi['meta']

      const Dummy = () => {
        ;[{ input, meta }] = useField('property')

        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      act(() => {
        input!.onFocus()
      })

      expect(meta!.active).toBe(true)

      act(() => {
        input!.onBlur()
      })

      expect(meta!.active).toBe(false)
    })

    it('should provide onChange', () => {
      let input: FieldApi['input']
      let meta: FieldApi['meta']

      const Dummy = () => {
        ;[{ input, meta }] = useField('property')

        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      act(() => {
        input!.onChange({
          currentTarget: {
            value: 'new value'
          }
        } as any)
      })

      expect(input!.value).toBe('new value')
    })

    it('should provide api and the app itself', () => {
      let api
      let app

      const Dummy = () => {
        ;[, api, app] = useField('property')
        return <div />
      }

      const App = () => {
        return (
          <Provider app={demoApp as any}>
            <Dummy />
          </Provider>
        )
      }

      render(<App />)

      expect(api).toBe(demoApp.api)
      expect(app).toBe(demoApp)
    })
  })
})
