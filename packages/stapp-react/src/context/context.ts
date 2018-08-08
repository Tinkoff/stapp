import {
  Component,
  ComponentType,
  createContext,
  createElement,
  ReactNode,
  StatelessComponent
} from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { createComponents } from '../createComponents/createComponents'
import { STAPP_REACT } from '../helpers/constants'
import { getDisplayName } from '../helpers/getDisplayName'
import { renderComponent } from '../helpers/renderComponent'

// Models
import { Stapp } from 'stapp'
import { FormBaseState } from 'stapp-formbase'
import { ConsumerProps, RenderProps } from '../createConsumer/createConsumer.h'
import { FieldProps } from '../createField/createField.h'
import { FormApi } from '../createForm/createForm.h'

export const StappContext = createContext<ReturnType<
  typeof createComponents
> | null>(null)

const provideComponents = (
  fn: (components: ReturnType<typeof createComponents>) => ReactNode
) => {
  return createElement(StappContext.Consumer, {
    children: (components: ReturnType<typeof createComponents> | null) => {
      if (!components) {
        throw new Error(`${STAPP_REACT} error: Provider missing!`)
      }

      return fn(components)
    }
  })
}

export const Provider: StatelessComponent<{
  app: Stapp<any, any>
  children?: ReactNode
}> = ({ app, children }) => {
  const components = createComponents(app as any)

  return createElement(StappContext.Provider, { value: components, children })
}
Provider.displayName = 'StappContext.Provider'

export const Consumer: StatelessComponent<ConsumerProps<any, any, any>> = (
  props
) => {
  return provideComponents((components) =>
    createElement(components.Consumer, props)
  )
}
Consumer.displayName = 'StappContext.Consumer'

export const Form: StatelessComponent<RenderProps<FormApi>> = (props) => {
  return provideComponents((components) =>
    createElement(components.Form, props)
  )
}
Form.displayName = 'StappContext.Form'

export const Field = <State extends FormBaseState, Extra>(
  props: FieldProps<State, Extra>
) => {
  return provideComponents((components) =>
    createElement(components.Field, props)
  )
}
;(Field as any).displayName = 'StappContext.Field'

export const consume = <Result>(
  map: (state: any, api: any, props: any) => Result = identity as any
) => (WrappedComponent: ComponentType<Partial<Result>>) => {
  return class Consume extends Component<any> {
    static displayName = `StappContext.Consume(${getDisplayName(
      WrappedComponent
    )})`

    mapState = (state: any, api: any) => map(state, api, this.props)

    render() {
      return createElement(Consumer, {
        map: this.mapState,
        render: (result: Result, api: any) =>
          renderComponent(
            'consume',
            {
              component: WrappedComponent
            },
            Object.assign({}, this.props, result),
            api
          )
      })
    }
  }
}
