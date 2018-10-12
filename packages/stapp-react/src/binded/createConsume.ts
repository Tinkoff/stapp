import { Component, ComponentClass, ComponentType, createElement } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { getDisplayName } from '../helpers/getDisplayName'

// Models
import { Stapp } from 'stapp'
import { ConsumeHoc } from '../models/ConsumeHoc'
import { ConsumerProps } from '../models/Props'

/**
 * Creates higher order component, that passes state and api from a Stapp application
 * to a wrapped component
 */
export const createConsume = <State, Api>(
  Consumer: ComponentClass<ConsumerProps<State, Api, any>>,
  name: string = 'Stapp'
): ConsumeHoc<State, Api> => {
  return (<Result>(
    map: (state: State, api: Api, props: any) => Result = identity as any
  ) => (WrappedComponent: ComponentType<Partial<Result>>) => {
    return class Consume extends Component<any> {
      static displayName = `${name}.Consume(${getDisplayName(
        WrappedComponent
      )})`

      mapState = (state: State, api: Api) => map(state, api, this.props)

      render() {
        return createElement(Consumer, {
          map: this.mapState,
          render: (result: Result, api: Api, app: Stapp<State, Api>) => {
            return createElement(
              WrappedComponent,
              Object.assign({}, this.props, { api, app }, result)
            )
          }
        })
      }
    }
  }) as any
}

/**
 * @hidden
 */
export const createInject = createConsume
