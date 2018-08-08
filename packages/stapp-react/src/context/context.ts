import {
  createContext,
  createElement,
  ReactNode,
  StatelessComponent
} from 'react'
import { createComponents } from '../createComponents/createComponents'
import { STAPP_REACT } from '../helpers/constants'

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

export const Provider = <State, Api>({
  app,
  children
}: {
  app: Stapp<State, Api>
  children?: ReactNode
}) => {
  const components = createComponents(app as any)

  return createElement(StappContext.Provider, { value: components, children })
}

export const Consumer: StatelessComponent<ConsumerProps<any, any, any>> = (
  props
) => {
  return provideComponents((components) =>
    createElement(components.Consumer, props)
  )
}

export const Form: StatelessComponent<RenderProps<FormApi>> = (props) => {
  return provideComponents((components) =>
    createElement(components.Form, props)
  )
}

export const Field = <State extends FormBaseState, Extra>(
  props: FieldProps<State, Extra>
) => {
  return provideComponents((components) =>
    createElement(components.Field, props)
  )
}
