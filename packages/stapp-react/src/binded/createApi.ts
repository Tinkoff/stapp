import { FunctionComponent } from 'react'
import { renderPropType } from '../helpers/propTypes'
import { renderComponent } from '../helpers/renderComponent'

// Models
import { Stapp } from 'stapp'
import { ApiProps } from '../models/Props'

export const createApi = <State, Api>(
  app: Stapp<State, Api>,
  name: string = 'Stapp'
): FunctionComponent<ApiProps<State, Api>> => {
  const Api = <A>(props: ApiProps<A, any>) => {
    return renderComponent({
      name: 'Api',
      renderProps: props,
      renderArgs: [app.api, app],
      componentProps: { api: app.api, app }
    })
  }
  ;(Api as FunctionComponent<any>).displayName = `${name}.Api`
  ;(Api as FunctionComponent<any>).propTypes = {
    render: renderPropType,
    children: renderPropType,
    component: renderPropType
  }

  return Api
}
