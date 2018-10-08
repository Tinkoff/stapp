// tslint:disable-next-line no-unused-variable
import React, {
  ComponentClass,
  createElement,
  StatelessComponent,
  SyntheticEvent
} from 'react'
import { formSelector } from 'stapp-formbase'
import { renderComponent } from '../helpers/renderComponent'
import { simpleMemoize } from '../helpers/simpleMemoize'

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

  const handle = simpleMemoize(
    (fn: () => void) => (syntheticEvent: SyntheticEvent<any>) => {
      // preventDefault might not exist in some environments (React Native e.g.)
      /* istanbul ignore next */
      if (
        syntheticEvent &&
        // tslint:disable-next-line strict-type-predicates
        typeof syntheticEvent.preventDefault === 'function'
      ) {
        syntheticEvent.preventDefault()
      }

      fn()
    }
  )

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
            handleSubmit: handle(api.formBase.submit),
            handleReset: handle(api.formBase.resetForm),
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
