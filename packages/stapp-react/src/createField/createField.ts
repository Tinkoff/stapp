// tslint:disable-next-line no-unused-variable
import React, { createElement, SyntheticEvent } from 'react'
import { fieldSelector, FormBaseState, setActive, setTouched, setValue } from 'stapp-formbase'

// Models
// tslint:disable-next-line no-unused-variable
import { ConsumerClass, ConsumerProps } from '../createConsumer/createConsumer.h'
import { renderComponent } from '../helpers/renderComponent'
import { FieldProps } from './createField.h'

/**
 * Creates react form helper.
 * See examples in the examples folder.
 *
 * @param Consumer
 */
export const createField = <State extends FormBaseState, Api>(
  Consumer: ConsumerClass<State, Api, any>
) => {
  const app = Consumer.app

  const Field = <Extra>({
    name,
    extraSelector,
    children,
    render,
    component
  }: FieldProps<State, Extra>) => {
    const handleChange = (event: SyntheticEvent<HTMLInputElement>) =>
      app.dispatch(
        setValue({
          [name]: event.currentTarget.value
        })
      )

    const handleBlur = () => {
      app.dispatch(setActive(null))
      app.dispatch(setTouched({ [name]: true }))
    }

    const handleFocus = () => app.dispatch(setActive(name))

    return createElement(Consumer, {
      map: fieldSelector(name, extraSelector),
      render: ({ value, error, dirty, touched, active, extra }: any) =>
        renderComponent(
          'Field',
          {
            children,
            render,
            component
          },
          {
            input: {
              name,
              value: value || '',
              onChange: handleChange,
              onBlur: handleBlur,
              onFocus: handleFocus
            },
            meta: {
              error,
              touched,
              active,
              dirty
            },
            extra
          },
          app.api
        )
    })
  }

  ;(Field as any).displayName = `${app.name}.Field`

  return Field
}
