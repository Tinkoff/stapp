// tslint:disable max-classes-per-file jsx-no-lambda
import { mount } from 'enzyme'
import React from 'react'
import { createApp, createEvent, createReducer } from 'stapp'
import { uniqueId } from 'stapp/lib/helpers/uniqueId/uniqueId'
import { createConsumer } from '../createConsumer/createConsumer'
import { createConsume } from './createConsume'

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

  it('should accepts props in mapState', (done) => {
    expect.assertions(4)

    const Consumer = getConsumer()
    const consume = createConsume(Consumer)

    const Dummy = consume((state, api, props) => ({
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
