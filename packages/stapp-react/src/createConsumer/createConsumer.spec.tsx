// tslint:disable max-classes-per-file jsx-no-lambda no-shadowed-variable
import { mount } from 'enzyme'
import { Subscription } from 'light-observable'
import React from 'react'
import { createApp } from 'stapp/lib/core/createApp/createApp'
import { createEvent } from 'stapp/lib/core/createEvent/createEvent'
import { createReducer } from 'stapp/lib/core/createReducer/createReducer'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { uniqueId } from 'stapp/lib/helpers/uniqueId/uniqueId'
import { createConsumer } from './createConsumer'

jest.useFakeTimers()

describe('createContext', () => {
  const initialState = {
    test: 0
  }

  const e1 = createEvent()
  const r1 = createReducer(initialState).on(e1, (state) => ({ test: state.test + 1 }))

  const getApp = (appName = 'test' + uniqueId()) =>
    createApp({
      name: appName,
      modules: [
        {
          name: 'test',
          reducers: {
            r1
          },
          events: {
            e1
          }
        }
      ]
    })

  it('should use selector to get state from app', () => {
    const app = getApp()
    const Consumer = createConsumer(app)

    mount(
      <Consumer map={(state) => state.r1.test}>
        {(state, { e1 }) => {
          expect(state).toEqual(0)
          expect(typeof e1).toBe('function')
          return <div />
        }}
      </Consumer>
    )
  })

  it('should batch store updates', async () => {
    const app = getApp()
    const Consumer = createConsumer(app)
    let count = 0

    mount(
      <Consumer>
        {() => {
          ++count
          return null
        }}
      </Consumer>
    )

    expect(count).toEqual(1)
    expect(app.getState().r1.test).toEqual(0)

    app.api.e1()
    app.api.e1()
    app.api.e1()
    expect(app.getState().r1.test).toEqual(3)
    expect(count).toEqual(1)

    jest.runTimersToTime(50)
    expect(count).toEqual(2)
  })

  it('should not rerender if selector returns same value', async () => {
    expect.assertions(3)

    let count = 0
    const value = {
      test: 1
    }
    const app = getApp()
    const Consumer = createConsumer(app)

    mount(
      <Consumer map={() => value}>
        {({ test }) => {
          count += 1
          expect(test).toEqual(1)

          return <div />
        }}
      </Consumer>
    )

    expect(count).toEqual(1)

    jest.runTimersToTime(50)
    app.api.e1()

    jest.runTimersToTime(50)
    expect(count).toEqual(1)
  })

  it('should unsubscribe on unmount', () => {
    const app = getApp()
    const subscribe = app.subscribe.bind(app)
    let subscription: Subscription

    app.subscribe = (subscriber: any) => {
      subscription = subscribe(subscriber)

      return subscription
    }

    const Consumer = createConsumer(app)
    const wrapper = mount(<Consumer>{() => <div />}</Consumer>)

    wrapper.unmount()
    expect(subscription!.closed).toBe(true)
  })

  it('should ignore any other props updates', () => {
    const app = getApp()
    const Consumer: any = createConsumer(app)

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
        return <Consumer t={this.state.t}>{this.renderDiv}</Consumer>
      }
    }

    mount(<Mock />)

    jest.runTimersToTime(50)

    expect(count).toBe(1)
  })

  it('should resubscribe on props update', async () => {
    const app = getApp()
    const Consumer: any = createConsumer(app)

    let count = 0

    class Mock extends React.Component<{}, any> {
      state = {
        map: undefined
      }

      componentWillMount() {
        setTimeout(() => {
          this.setState({
            map: (x: any) => x
          })
        }, 50)

        setTimeout(() => {
          this.setState({
            map: (x: any) => x
          })
        }, 50)

        setTimeout(() => {
          this.setState({
            map: (x: any) => x
          })
        }, 50)
      }

      render() {
        return (
          <Consumer map={this.state.map}>
            {() => {
              count += 1
              return <div />
            }}
          </Consumer>
        )
      }
    }

    mount(<Mock />)

    jest.runTimersToTime(200)
    expect(count).toBe(4)
  })

  it('can accept component prop', () => {
    expect.assertions(1)

    const DummyComponent = (props: any) => {
      expect(props.r1).toEqual({ test: 0 })

      return null
    }
    const app = getApp()
    const Consumer = createConsumer(app)

    mount(<Consumer component={DummyComponent} />)
  })
})
