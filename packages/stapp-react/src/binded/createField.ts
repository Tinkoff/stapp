// tslint:disable-next-line no-unused-variable
import React, {
  ComponentClass,
  createElement,
  FunctionComponent,
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
): FunctionComponent<FieldProps<State>> => {
  const Field = (props: FieldProps<State>) => {
    const selector = fieldSelector(props.name, props.extraSelector)

    const handleChange = (api: any) => (
      event: SyntheticEvent<HTMLInputElement>
    ) => {
      api.formBase.setValue({
        [props.name]: event.currentTarget.value
      })
    }

    const handleBlur = (api: any, active: boolean) => () => {
      active && api.formBase.setActive(null)
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
        const result = {
          input: {
            name: props.name,
            value: fieldState.value || '',
            onChange: handleChange(api),
            onBlur: handleBlur(api, fieldState.active),
            onFocus: handleFocus(api)
          },
          meta: {
            error: fieldState.error,
            touched: fieldState.touched,
            active: fieldState.active,
            dirty: fieldState.dirty
          },
          extra: fieldState.extra
        }

        return renderComponent({
          name: 'Field',
          renderProps: props,
          renderArgs: [result, api, app],
          componentProps: Object.assign({ api, app }, result)
        })
      }
    })
  }
  ;(Field as FunctionComponent).displayName = `${appName}.Field`

  return Field
}
