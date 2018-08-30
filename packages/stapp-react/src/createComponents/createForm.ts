// tslint:disable-next-line no-unused-variable
import React, { ComponentClass, createElement, StatelessComponent } from 'react'
import { formSelector } from 'stapp-formbase'
import { renderComponent } from '../helpers/renderComponent'

// Models
import { Stapp } from 'stapp'
import { FormApi } from '../models/Form'
import { ConsumerProps, RenderProps } from '../models/Props'

/**
 * Creates react form helpers
 */
export const createForm = <State, Api>(
  Consumer: ComponentClass<ConsumerProps<State, Api, any>>,
  name: string = 'Stapp'
): StatelessComponent<RenderProps<FormApi>> => {
  const formDataSelector = formSelector()

  const Form = (props: RenderProps<FormApi>) => {
    return createElement(Consumer, {
      map: formDataSelector,
      render: (
        formData: ReturnType<typeof formDataSelector>,
        api: any,
        app: Stapp<State, Api>
      ) => {
        return renderComponent({
          name: 'Form',
          renderProps: props,
          result: {
            handleSubmit: api.formBase.submit,
            handleReset: api.formBase.resetForm,
            submitting: formData.submitting,
            valid: formData.valid,
            ready: formData.ready,
            dirty: formData.dirty,
            pristine: formData.pristine
          },
          api,
          app
        })
      }
    })
  }

  ;(Form as StatelessComponent<any>).displayName = `${name}.Form`

  return Form
}
