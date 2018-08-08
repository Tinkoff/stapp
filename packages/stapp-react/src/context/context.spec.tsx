import { mount } from 'enzyme'
import React from 'react'
import { createApp, createEvent, createReducer } from 'stapp'
import { formBase } from 'stapp-formbase'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import {
  consume,
  Consumer,
  Field,
  Form,
  Provider,
  StappContext
} from './context'

describe('context tools', () => {
  const inc = createEvent()
  const dec = createEvent()
  const testModule = {
    name: 'test',
    state: {
      counter: createReducer(0)
        .on(inc, (s) => s + 1)
        .on(dec, (s) => s - 1)
    },
    api: {
      inc,
      dec
    }
  }
  const app = createApp({
    name: 'test',
    modules: [
      loggerModule({ pattern: undefined }),
      formBase<{ test1: string }>({
        initialValues: {
          test1: '1'
        }
      }),
      testModule
    ]
  })

  const getCatcher = (cb: any) =>
    class Catch extends React.Component {
      state = { error: false }

      componentDidCatch(error: any) {
        cb(error)
      }

      render() {
        return this.props.children
      }
    }

  describe('Provider', () => {
    it('should provide context', () => {
      expect.assertions(5)

      mount(
        <Provider app={app}>
          <StappContext.Consumer>
            {(components) => {
              expect(components).toBeDefined()
              expect(components!.Consumer).toBeDefined()
              expect(components!.consume).toBeDefined()
              expect(components!.Form).toBeDefined()
              expect(components!.Field).toBeDefined()
              return <div />
            }}
          </StappContext.Consumer>
        </Provider>
      )
    })
  })

  describe('Consumer', () => {
    it('should get Consume from context', () => {
      expect.assertions(2)

      mount(
        <Provider app={app}>
          <Consumer map={(state) => state.counter}>
            {(state, { inc }) => {
              expect(state).toEqual(0)
              expect(typeof inc).toBe('function')
              return <div />
            }}
          </Consumer>
        </Provider>
      )
    })

    it('throws if components are not provided', () => {
      const cb = jest.fn()
      const Catcher = getCatcher(cb)
      mount(
        <Catcher>
          <Consumer>{() => <div />}</Consumer>
        </Catcher>
      )

      expect(cb).toBeCalled()
    })
  })

  describe('consume', () => {
    it('should work with stateless components', (done) => {
      expect.assertions(3)

      const Dummy = consume()((props: any) => {
        expect(typeof props.inc).toBe('function')
        expect(typeof props.dec).toBe('function')
        expect(props.counter).toEqual(0)

        done()

        return <div />
      })
      mount(
        <Provider app={app}>
          <Dummy />
        </Provider>
      )
    })

    it('should utilize provided map', (done) => {
      expect.assertions(1)

      const Dummy = consume((state) => ({ c: state.counter }))((props: any) => {
        expect(props.c).toEqual(0)
        done()

        return <div />
      })
      mount(
        <Provider app={app}>
          <Dummy />
        </Provider>
      )
    })

    it('throws if components are not provided', () => {
      const Dummy = consume()(() => <div />)
      const cb = jest.fn()
      const Catcher = getCatcher(cb)
      mount(
        <Catcher>
          <Dummy />
        </Catcher>
      )

      expect(cb).toBeCalled()
    })
  })

  describe('Form', () => {
    it('should get Form from context', () => {
      expect.assertions(1)

      mount(
        <Provider app={app}>
          <Form>
            {({ handleSubmit }) => {
              expect(typeof handleSubmit).toBe('function')
              return <div />
            }}
          </Form>
        </Provider>
      )
    })

    it('throws if components are not provided', () => {
      const cb = jest.fn()
      const Catcher = getCatcher(cb)
      mount(
        <Catcher>
          <Form>{() => <div />}</Form>
        </Catcher>
      )

      expect(cb).toBeCalled()
    })
  })

  describe('Field', () => {
    it('should get Field from context', () => {
      expect.assertions(2)

      mount(
        <Provider app={app}>
          <Field name="test1">
            {({ input }) => {
              expect(input.name).toEqual('test1')
              expect(input.value).toEqual(app.getState().values.test1)
              return <div />
            }}
          </Field>
        </Provider>
      )
    })

    it('throws if components are not provided', () => {
      const cb = jest.fn()
      const Catcher = getCatcher(cb)
      mount(
        <Catcher>
          <Field name="test1">{() => <div />}</Field>
        </Catcher>
      )

      expect(cb).toBeCalled()
    })
  })
})
