// tslint:disable jsx-no-lambda no-shadowed-variable max-classes-per-file
import { mount } from 'enzyme'
import { Subscription } from 'light-observable'
import React from 'react'
import { StappState } from 'stapp'
import { getApp } from '../helpers/testApp'
import { Consumer } from './Consumer'
import { Provider, StappContext } from './Provider'

describe('context tools', () => {
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
    it('should provide state and app', () => {
      expect.assertions(2)
      const app = getApp()

      mount(
        <Provider app={app}>
          <StappContext.Consumer>
            {({ state, app: innerApp }) => {
              expect(state).toEqual(app.getState())
              expect(innerApp).toBe(app)
              return <div />
            }}
          </StappContext.Consumer>
        </Provider>
      )
    })
  })

  describe('Consumer', () => {
    it('should get state from context with selector', () => {
      expect.assertions(2)
      const app = getApp()

      mount(
        <Provider app={app}>
          <Consumer map={(state: StappState<typeof app>) => state.counter}>
            {(state, { inc }) => {
              expect(state).toEqual(0)
              expect(typeof inc).toBe('function')
              return <div />
            }}
          </Consumer>
        </Provider>
      )
    })

    it('should not rerender if selector returns same value', async () => {
      expect.assertions(3)
      let renders = 0
      const value = 1
      const app = getApp()

      mount(
        <Provider app={app}>
          <Consumer map={() => value}>
            {(v) => {
              renders += 1
              expect(v).toEqual(1)

              return <div />
            }}
          </Consumer>
        </Provider>
      )

      expect(renders).toEqual(1)

      app.api.dec()
      app.api.dec()
      app.api.dec()

      expect(renders).toEqual(1)
    })

    it('should unsubscribe on unmount', () => {
      const app = getApp()
      const subscribe = app.subscribe.bind(app)
      let subscription: Subscription

      app.subscribe = (subscriber: any) => {
        subscription = subscribe(subscriber)

        return subscription
      }

      const wrapper = mount(
        <Provider app={app}>
          <Consumer>{() => <div />}</Consumer>
        </Provider>
      )

      wrapper.unmount()
      expect(subscription!.closed).toBe(true)
    })

    it('should ignore any other props updates', () => {
      const app = getApp()
      const C = Consumer as any
      let count = 0

      class Mock extends React.Component<{}, any> {
        state = { t: 1 }

        componentWillMount() {
          setTimeout(() => {
            this.setState({
              t: 2
            })
          }, 25)
        }

        renderDiv = () => {
          count += 1
          return <div />
        }

        render() {
          return (
            <Provider app={app}>
              <C t={this.state.t}>{this.renderDiv}</C>
            </Provider>
          )
        }
      }

      mount(<Mock />)
      expect(count).toBe(1)
    })

    it('can accept component prop', () => {
      expect.assertions(3)

      const app = getApp()

      const DummyComponent = (props: any) => {
        expect(props.counter).toEqual(0)
        expect(props.app).toBe(app)
        expect(props.api).toBe(app.api)

        return null
      }

      mount(
        <Provider app={app}>
          <Consumer component={DummyComponent} />
        </Provider>
      )
    })

    it('throws if components are not provided', () => {
      const cb = jest.fn()
      const Catcher = getCatcher(cb)
      try {
        mount(
          // <Catcher>
          <Consumer>{() => <div />}</Consumer>
          // </Catcher>
        )
      } catch (e) {
        expect(e).toBeDefined()
      }

      // expect(cb).toBeCalled()
    })
  })
})
