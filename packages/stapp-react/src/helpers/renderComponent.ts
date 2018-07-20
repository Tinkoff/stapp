import React, { ReactElement } from 'react'
import { RenderProps } from '../createConsumer/createConsumer.h'
import { STAPP_REACT } from './constants'

export const renderComponent = (
  name: string,
  props: RenderProps<any, any>,
  ...values: any[]
): ReactElement<any> | null => {
  const { render, children, component } = props

  if (component) {
    return React.createElement(component, Object.assign({}, ...values))
  }

  if (render) {
    return (render as any)(...values)
  }

  if (typeof children === 'function') {
    return (children as any)(...values)
  }

  throw new Error(
    `${STAPP_REACT} error: Must specify either a render prop, a render function as children, or a component prop to ${name}`
  )
}
