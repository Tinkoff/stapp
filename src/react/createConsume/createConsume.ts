import { Component, ComponentClass, ComponentType, createElement } from 'react'
import { identity } from '../../helpers/identity/identity'
import { defaultMergeProps } from '../helpers/defaultMergeProps'
import { getDisplayName } from '../helpers/getDisplayName'

// Models
import { ConsumerProps } from '../createConsumer/createConsumer.h'
import { ConsumerHoc } from './createConsume.h'

/**
 * Creates higher order component, that passes state and api from a Stapp application to
 * a wrapped component
 */
export const createConsume = <State, Api>(
  Consumer: ComponentClass<ConsumerProps<State, Api, any, any, any>>
): ConsumerHoc<State, Api> => {
  return (<SelectedState, SelectedApi, Result>(
    mapState: (state: State, props: any) => SelectedState = identity as any,
    mapApi: (api: Api, props: any) => SelectedApi = identity as any,
    mergeProps: (state: SelectedState, api: SelectedApi, props: any) => Result = defaultMergeProps
  ) => (WrappedComponent: ComponentType<Partial<SelectedState & SelectedApi>>) => {
    return class Consume extends Component<any> {
      static displayName = `Consume(${getDisplayName(WrappedComponent)})`

      mapState = (state: State) => mapState(state, this.props)
      mapApi = (api: Api) => mapApi(api, this.props)
      mergeProps = (state: SelectedState, api: SelectedApi) => mergeProps(state, api, this.props)

      renderWrapped = (result: Result) => {
        return createElement(WrappedComponent, Object.assign({}, this.props, result))
      }

      render() {
        return createElement(Consumer, {
          mapState: this.mapState,
          mapApi: this.mapApi,
          mergeProps: this.mergeProps,
          render: this.renderWrapped
        })
      }
    }
  }) as any
}

/**
 * @hidden
 */
export const createInject = createConsume
