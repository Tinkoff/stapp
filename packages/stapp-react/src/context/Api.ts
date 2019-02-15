import { createElement, FunctionComponent } from 'react'
import { STAPP_REACT } from '../helpers/constants'
import { renderPropType } from '../helpers/propTypes'
import { renderComponent } from '../helpers/renderComponent'

// Models
import { Stapp } from 'stapp'
import { ApiProps } from '../models/Props'
import { StappContext } from '../shared/StappContext'

export const Api = <A>(props: ApiProps<A, any>) => {
  return createElement(StappContext.Consumer, {
    children(app: Stapp<any, A>) {
      /* istanbul ignore next */
      if (!app) {
        throw new Error(`${STAPP_REACT} error: Provider missing!`)
      }

      return renderComponent({
        name: 'Api',
        renderProps: props,
        renderArgs: [app.api, app],
        componentProps: { api: app.api, app }
      })
    }
  })
}
;(Api as FunctionComponent<any>).displayName = 'Stapp.Provider'
;(Api as FunctionComponent<any>).propTypes = {
  render: renderPropType,
  children: renderPropType,
  component: renderPropType
}
