import React from 'react'
import { Stapp } from 'stapp'
import { renderComponent } from './renderComponent'

describe('(helpers) renderComponent', () => {
  it('should call provided render function', () => {
    const render = jest.fn()
    const testA = {}
    const testB = {}
    const testC = {}

    renderComponent({
      name: 'test',
      renderProps: {
        render
      },
      result: testA,
      api: testB,
      app: testC as Stapp<any, any>
    })

    expect(render).toBeCalledWith(testA, testB, testC)
  })

  it('should call provided render function', () => {
    const children = jest.fn()
    const testA = {}
    const testB = {}
    const testC = {}

    renderComponent({
      name: 'test',
      renderProps: {
        children
      },
      result: testA,
      api: testB,
      app: testC as Stapp<any, any>
    })

    expect(children).toBeCalledWith(testA, testB, testC)
  })

  it('should render provided component with provided props', () => {
    const testA = { testA: 123 }
    const testB = { testB: 321 }
    const testC = {}

    const Component = (props: any) => {
      expect(props.testA).toBe(123)
      expect(props.api).toBe(testB)
      expect(props.app).toBe(testC)

      expect(props).toEqual({
        testA: 123,
        testB: 321
      })
      return <div />
    }

    renderComponent({
      name: 'test',
      renderProps: { component: Component },
      result: testA,
      api: testB,
      app: testC as Stapp<any, any>
    })
  })

  it('should throw if no render prop was provided', () => {
    expect(() =>
      renderComponent({
        name: 'test',
        renderProps: {},
        result: {},
        api: {},
        app: {} as Stapp<any, any>
      })
    ).toThrow()
  })
})
