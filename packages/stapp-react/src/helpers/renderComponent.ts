import React, { ReactElement } from 'react'
import { RenderProps } from '../models/Props'
import { STAPP_REACT } from './constants'

export const renderComponent = (parameters: {
  name: string
  renderProps: RenderProps<any, any>
  renderArgs: any[]
  componentProps: any
}): ReactElement<any> | null => {
  const {
    name,
    renderProps: { render, children, component },
    renderArgs,
    componentProps
  } = parameters

  if (component) {
    return React.createElement(component, componentProps)
  }

  if (render) {
    return render.apply(null, renderArgs)
  }

  if (typeof children === 'function') {
    return children.apply(null, renderArgs)
  }

  throw new Error(
    `${STAPP_REACT} error: Must specify either a render prop, a render function as children, or a component prop to ${name}`
  )
}
