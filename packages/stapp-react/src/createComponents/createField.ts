// tslint:disable-next-line no-unused-variable
import React, {
  ComponentClass,
  createElement,
  StatelessComponent,
  SyntheticEvent
} from 'react'
import { fieldSelector, FormBaseState } from 'stapp-formbase'

// Models
// tslint:disable-next-line no-unused-variable
import { Stapp } from 'stapp'
import { renderComponent } from '../helpers/renderComponent'
import { ConsumerProps, FieldProps } from '../models/Props'

/**
 * Creates react form helper.
 * See examples in the examples folder.
 */
export const createField = <State extends FormBaseState, Api>(
  Consumer: ComponentClass<ConsumerProps<State, Api, any>>,
  appName: string = 'Stapp'
): StatelessComponent<FieldProps<State>> => {
  const Field = (props: FieldProps<State>) => {
    const selector = fieldSelector(props.name, props.extraSelector)

    const handleChange = (api: any) => (
      event: SyntheticEvent<HTMLInputElement>
    ) => {
      api.formBase.setValue({
        [props.name]: event.currentTarget.value
      })
    }

    const handleBlur = (api: any) => () => {
      api.formBase.setActive(null)
      api.formBase.setTouched({ [props.name]: true })
    }

    const handleFocus = (api: any) => () => {
      api.formBase.setActive(props.name)
    }

    return createElement(Consumer, {
      map: selector,
      children: (
        fieldState: ReturnType<typeof selector>,
        api: any,
        app: Stapp<State, Api>
      ) => {
        return renderComponent({
          name: 'Field',
          renderProps: props,
          result: {
            input: {
              name,
              value: fieldState.value || '',
              onChange: handleChange(api),
              onBlur: handleBlur(api),
              onFocus: handleFocus(api)
            },
            meta: {
              error: fieldState.error,
              touched: fieldState.touched,
              active: fieldState.active,
              dirty: fieldState.dirty
            },
            extra: fieldState.extra
          },
          api,
          app
        })
      }
    })
  }

  ;(Field as StatelessComponent).displayName = `${appName}.Field`

  return Field
}
