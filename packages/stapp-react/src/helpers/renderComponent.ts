import invariant from 'fbjs/lib/invariant'
import React, { ReactElement } from 'react'
import { RenderProps } from '../createConsumer/createConsumer.h'

export const renderComponent = (
  props: RenderProps<any>,
  passedProps: any,
  name: string
): ReactElement<any> | null => {
  const { render, children, component } = props

  if (component) {
    return React.createElement(component, { ...passedProps, children, render })
  }

  if (render) {
    return render({ ...passedProps, children })
  }

  invariant(
    typeof children === 'function',
    `Stapp error: Must specify either a render prop, a render function as children, or a component prop to ${name}`
  )

  // Typeof 'function' is already assured so any is ok
  return (children as any)(passedProps)
}
