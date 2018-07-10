import React from 'react'
import { renderComponent } from './renderComponent'

describe('(helpers) renderComponent', () => {
  it('should call provided render function', () => {
    const render = jest.fn()
    const testA = {}
    const testB = {}

    renderComponent('test', { render }, testA, testB)

    expect(render).toBeCalledWith(testA, testB)
  })
  it('should call provided children function', () => {
    const children = jest.fn()
    const testA = {}
    const testB = {}

    renderComponent('test', { children }, testA, testB)

    expect(children).toBeCalledWith(testA, testB)
  })

  it('should render provided component with provided props', () => {
    const testA = { testA: 123 }
    const testB = { testB: 321 }
    const Component = (props: any) => {
      expect(props).toEqual({
        testA: 123,
        testB: 321
      })
      return <div />
    }

    renderComponent('test', { component: Component }, testA, testB)
  })

  it('should throw if no render prop was provided', () => {
    expect(() => renderComponent('test', {})).toThrow()
  })
})
