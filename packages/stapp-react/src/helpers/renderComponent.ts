import React, { ReactElement } from 'react'
import { Stapp } from 'stapp'
import { RenderProps } from '../models/Props'
import { STAPP_REACT } from './constants'

export const renderComponent = (parameters: {
  name: string
  renderProps: RenderProps<any, any>
  result: any
  api: any
  app: Stapp<any, any>
}): ReactElement<any> | null => {
  const { name, renderProps, result, api, app } = parameters
  const { render, children, component } = renderProps

  if (component) {
    return React.createElement(component, Object.assign({ api, app }, result))
  }

  if (render) {
    return render(result, api, app)
  }

  if (typeof children === 'function') {
    return children(result, api, app)
  }

  throw new Error(
    `${STAPP_REACT} error: Must specify either a render prop, a render function as children, or a component prop to ${name}`
  )
}
