// tslint:disable max-classes-per-file jsx-no-lambda no-shadowed-variable
import { mount } from 'enzyme'
import { Subscription } from 'light-observable'
import React from 'react'
import { getApp } from '../helpers/testApp'
import { createConsumer } from './createConsumer'

jest.useFakeTimers()

describe('createConsumer', () => {
  const initialState = {
    test: 0
  }

  it('should use selector to get state from app', () => {
    const app = getApp()
    const Consumer = createConsumer(app)

    mount(
      <Consumer map={(state) => state.counter}>
        {(state, { inc }) => {
          expect(state).toEqual(0)
          expect(typeof inc).toBe('function')
          return <div />
        }}
      </Consumer>
    )
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
    app.api.inc()

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

  it('can accept component prop', () => {
    expect.assertions(3)

    const app = getApp()

    const DummyComponent = (props: any) => {
      expect(props.counter).toEqual(0)
      expect(props.app).toBe(app)
      expect(props.api).toBe(app.api)

      return null
    }
    const Consumer = createConsumer(app)

    mount(<Consumer component={DummyComponent} />)
  })
})
