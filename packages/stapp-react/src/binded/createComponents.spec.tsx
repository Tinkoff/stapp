// tslint:disable max-classes-per-file jsx-no-lambda
import { mount } from 'enzyme'
import React from 'react'
import { createApi, createConsume, createConsumer } from '..'
import { getApp } from '../helpers/testApp'
import { createComponents } from './createComponents'

describe('createComponents', () => {
  it('should return Consumer, consume, Form and Field as object', () => {
    const app = getApp()

    const { Consumer, consume, Form, Field, Api } = createComponents(app)

    expect(Consumer).toBeTruthy()
    expect(consume).toBeTruthy()
    expect(Api).toBeTruthy()
    expect(Form).toBeTruthy()
    expect(Field).toBeTruthy()
  })

  describe('createConsume', () => {
    const getConsumer = () => createConsumer(getApp())

    it('should pass state to wrapped component', (done) => {
      expect.assertions(3)

      const app = getApp()
      const Consumer = createConsumer(app)
      const consume = createConsume(Consumer)

      const Dummy = consume()(
        class extends React.Component<any> {
          componentDidMount() {
            expect(this.props.app).toBe(app)
            expect(this.props.api).toBe(app.api)
            expect(this.props.counter).toEqual(0)

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
        test: state.counter + 5,
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
        test: state.counter + 5,
        test2: 'test',
        props: { test3: props.test3 }
      }))(
        class extends React.Component<{
          test: number
          test2: string
          test3: boolean
          props: any
        }> {
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
      expect.assertions(3)

      const app = getApp()
      const Consumer = createConsumer(app)
      const consume = createConsume(Consumer)

      const Dummy = consume()((props: any) => {
        expect(props.app).toBe(app)
        expect(props.api).toBe(app.api)
        expect(props.counter).toEqual(0)

        done()

        return <div />
      })
      mount(<Dummy />)
    })
  })

  describe('Api', () => {
    it('should get api and app from context', () => {
      expect.assertions(2)
      const app = getApp()
      const Api = createApi(app)

      mount(
        <Api>
          {({ inc }, innerApp) => {
            expect(typeof inc).toBe('function')
            expect(innerApp).toBe(app)
            return <div />
          }}
        </Api>
      )
    })
  })
})
