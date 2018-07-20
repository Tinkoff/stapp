import { Component, ComponentType, createElement } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { getDisplayName } from '../helpers/getDisplayName'
import { renderComponent } from '../helpers/renderComponent'

// Models
import { ConsumerClass } from '../createConsumer/createConsumer.h'
import { ConsumerHoc } from './createConsume.h'

/**
 * Creates higher order component, that passes state and api from a Stapp application to
 * a wrapped component
 */
export const createConsume = <State, Api>(
  Consumer: ConsumerClass<State, Api, any>
): ConsumerHoc<State, Api> => {
  return (<SelectedState, SelectedApi, Result>(
    map: (state: State, api: Api, props: any) => SelectedState = identity as any
  ) => (WrappedComponent: ComponentType<Partial<SelectedState & SelectedApi>>) => {
    return class Consume extends Component<any> {
      static displayName = `${Consumer.app.name}.Consume(${getDisplayName(WrappedComponent)})`

      mapState = (state: State, api: Api) => map(state, api, this.props)

      render() {
        return createElement(Consumer, {
          map: this.mapState,
          render: (result: Result) =>
            renderComponent(
              'consume',
              {
                component: WrappedComponent
              },
              Object.assign({}, this.props, result),
              Consumer.app.api
            )
        })
      }
    }
  }) as any
}

/**
 * @hidden
 */
export const createInject = createConsume
