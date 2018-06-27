// tslint:disable max-classes-per-file jsx-no-lambda no-shadowed-variable
import { mount } from 'enzyme'
import React from 'react'
import { createApp } from '../../core/createApp/createApp'
import { createEvent } from '../../core/createEvent/createEvent'
import { createReducer } from '../../core/createReducer/createReducer'
import { identity } from '../../helpers/identity/identity'
import { uniqueId } from '../../helpers/uniqueId/uniqueId'
import { defaultMergeProps } from '../helpers/defaultMergeProps'
import { createConsumer } from './createConsumer'

describe('createContext', () => {
  const initialState = {
    test: 0
  }

  const e1 = createEvent()
  const r1 = createReducer(initialState).on(e1, (state) => ({ test: state.test + 1 }))

  const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n))

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
      <Consumer mapState={(state) => state.r1}>
        {({ test, e1 }) => {
          expect(test).toEqual(0)
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

    await wait(50)
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
      <Consumer mapState={() => value}>
        {({ test }) => {
          count += 1
          expect(test).toEqual(1)

          return <div />
        }}
      </Consumer>
    )

    expect(count).toEqual(1)

    await wait(50)
    app.api.e1()

    await wait(50)
    expect(count).toEqual(1)
  })

  it('should unsubscribe on unmount', () => {
    const app = getApp()
    const mockedUnsubscribe = jest.fn()

    const subscribe = app.state$.subscribe.bind(app.state$)

    app.state$.subscribe = (fn: any) => {
      const subscription = subscribe(fn)
      const unsubscribe = subscription.unsubscribe.bind(subscription)

      subscription.unsubscribe = () => {
        mockedUnsubscribe()
        return unsubscribe()
      }

      return subscription
    }

    const Consumer = createConsumer(app)
    const wrapper = mount(<Consumer>{() => <div />}</Consumer>)

    wrapper.unmount()

    expect(mockedUnsubscribe).toBeCalled()
  })

  it('should ignore any other props updates', (done) => {
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

      render() {
        return (
          <Consumer t={this.state.t}>
            {() => {
              count += 1
              return <div />
            }}
          </Consumer>
        )
      }
    }

    mount(<Mock />)

    setTimeout(() => {
      expect(count).toBe(1)
      done()
    }, 50)
  })

  it('should resubscribe on props update', async () => {
    const app = getApp()
    const Consumer: any = createConsumer(app)

    let count = 0

    class Mock extends React.Component<{}, any> {
      state = {
        mapState: undefined,
        mapApi: undefined,
        mergeProps: undefined
      }

      async componentWillMount() {
        await wait(50)
        this.setState({
          mapState: identity
        })

        await wait(50)
        this.setState({
          mapApi: identity
        })

        await wait(50)
        this.setState({
          mergeProps: defaultMergeProps
        })
      }

      render() {
        return (
          <Consumer
            mapState={this.state.mapState}
            mapApi={this.state.mapApi}
            mergeProps={this.state.mergeProps}
          >
            {() => {
              count += 1
              return <div />
            }}
          </Consumer>
        )
      }
    }

    mount(<Mock />)

    await wait(200)
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
