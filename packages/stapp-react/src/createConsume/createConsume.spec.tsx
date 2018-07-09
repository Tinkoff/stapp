// tslint:disable max-classes-per-file jsx-no-lambda
import React from 'react'
import { createApp, createEvent, createReducer } from 'stapp'
import { createConsume } from './createConsume'
import { createConsumer } from '../createConsumer/createConsumer'
import { mount } from 'enzyme'
import { uniqueId } from 'stapp/lib/helpers/uniqueId/uniqueId'

describe('createConsume', () => {
  const initialState = {
    test: 0
  }

  const e1 = createEvent()
  const r1 = createReducer(initialState).on(e1, (state) => ({ test: state.test + 1 }))

  const getApp = () =>
    createApp({
      name: 'test' + uniqueId(),
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

  const getConsumer = () => createConsumer(getApp())

  it('should pass state to wrapped component', (done) => {
    expect.assertions(2)

    const Consumer = getConsumer()
    const consume = createConsume(Consumer)

    const Dummy = consume()(
      class extends React.Component<any> {
        componentDidMount() {
          expect(typeof this.props.e1).toBe('function')
          expect(this.props.r1).toEqual(initialState)

          done()
        }

        render() {
          return <div />
        }
      }
    )

    mount(<Dummy />)
  })

  it('should use mapState', (done) => {
    expect.assertions(4)

    const Consumer = getConsumer()
    const consume = createConsume(Consumer)

    const Dummy = consume((state) => ({
      test: state.r1.test + 5,
      test2: 'test'
    }))(
      class extends React.Component<{
        test: number
        test2: string
        test3: boolean
        test4: string
      }> {
        componentDidMount() {
          expect(this.props.test).toEqual(5)
          expect(this.props.test2).toEqual('test')
          expect(this.props.test3).toEqual(true)
          expect(this.props.test4).toEqual('')

          done()
        }

        render() {
          return <div />
        }
      }
    )
    mount(<Dummy test3={true} test4={''} />)
  })

  it('should use mapApi', (done) => {
    expect.assertions(2)

    const Consumer = getConsumer()
    const app = Consumer.app
    const consume = createConsume(Consumer)

    const Dummy = consume(undefined, (api) => ({
      e2: api.e1
    }))(
      class extends React.Component<{ e2: any; test4: string }> {
        componentDidMount() {
          expect(this.props.e2).toEqual(app.api.e1)
          expect(this.props.test4).toEqual('')

          done()
        }

        render() {
          return <div />
        }
      }
    )
    mount(<Dummy test4={''} />)
  })

  it('should accept props at mapApi', (done) => {
    expect.assertions(3)

    const Consumer = getConsumer()
    const app = Consumer.app
    const consume = createConsume(Consumer)

    const Dummy = consume(undefined, (api, props) => ({
      e1: {
        test3: props.test4
      },
      e2: api.e1
    }))(
      class extends React.Component<{ e2: any; e1: any; test4: string }> {
        componentDidMount() {
          expect(this.props.e2).toEqual(app.api.e1)
          expect(this.props.test4).toEqual('')
          expect(this.props.e1).toEqual({
            test3: this.props.test4
          })

          done()
        }

        render() {
          return <div />
        }
      }
    )
    mount(<Dummy test4={''} />)
  })

  it('should accepts props in mapState', (done) => {
    expect.assertions(4)

    const Consumer = getConsumer()
    const consume = createConsume(Consumer)

    const Dummy = consume((state, props) => ({
      test: state.r1.test + 5,
      test2: 'test',
      props: { test3: props.test3 }
    }))(
      class extends React.Component<{ test: number; test2: string; test3: boolean; props: any }> {
        componentDidMount() {
          expect(this.props.test).toEqual(5)
          expect(this.props.test2).toEqual('test')
          expect(this.props.test3).toEqual(true)
          expect(this.props.props).toEqual({
            test3: this.props.test3
          })

          done()
        }

        render() {
          return <div />
        }
      }
    )
    mount(<Dummy test3={true} />)
  })

  it('should accept mergeprops', (done) => {
    expect.assertions(4)

    const Consumer = getConsumer()
    const consume = createConsume(Consumer)

    const Dummy = consume(
      (state, props) => ({
        test: state.r1.test + 5,
        test2: 'test',
        props: { test3: props.test3 }
      }),
      (api) => ({
        e2: api.e1
      }),
      (state, api) => ({
        test5: state.test,
        test6: state.test2,
        test7: api.e2
      })
    )(
      class extends React.Component<{
        test5: number
        test6: string
        test7: any
        test3: boolean
      }> {
        componentDidMount() {
          expect(this.props.test3).toEqual(true)
          expect(this.props.test5).toEqual(5)
          expect(this.props.test6).toEqual('test')
          expect(typeof this.props.test7).toEqual('function')

          done()
        }

        render() {
          return <div />
        }
      }
    )
    mount(<Dummy test3={true} />)
  })

  it('should work with stateless components', (done) => {
    expect.assertions(2)

    const Consumer = getConsumer()
    const consume = createConsume(Consumer)

    const Dummy = consume()((props: any) => {
      expect(typeof props.e1).toBe('function')
      expect(props.r1).toEqual(initialState)

      done()

      return <div />
    })
    mount(<Dummy />)
  })
})
