import React, { StatelessComponent, SyntheticEvent } from 'react'
import { formSelector, resetForm, submit } from 'stapp-formbase'
import { renderComponent } from '../helpers/renderComponent'

// Models
import { Event } from 'stapp/lib/core/createEvent/createEvent.h'
import { ConsumerClass, RenderProps } from '../createConsumer/createConsumer.h'
import { FormApi } from './createForm.h'

/**
 * Creates react form helpers
 *
 * ## Form example
 * ```typescript
 *  import { createForm } from 'stapp/lib/react'
 *  import someApp from '../myApps/app.js'
 *
 *  const { Form, Field } = createForm(someApp)
 *
 *  <Form>
 *    {
 *      ({
 *        handleSubmit,
 *        isReady,
 *        isValid
 *      }) => <form onSubmit={ handleSubmit }>
 *        <Field name='name'>
 *          {
 *            ({ input, meta }) => <React.Fragment>
 *              <input { ...input} />
 *              { meta.touched && meta.error && <span>{ meta.error }</span> }
 *            </React.Fragment>
 *          }
 *        </Field>
 *        <button
 *          type='submit'
 *          disabled={!isReady || !isValid}
 *         >
 *          Submit
 *         </button>
 *      </form>
 *    }
 *  </Form>
 * ```
 *
 * See more examples in the examples folder.
 *
 * @param Consumer
 */
export const createForm = <State, Api>(
  Consumer: ConsumerClass<State, Api, any, any, any>
): StatelessComponent<RenderProps<FormApi>> => {
  const app = Consumer.app
  const formDataSelector = formSelector()

  const handle = (event: Event<any, any>) => (syntheticEvent: SyntheticEvent<any>) => {
    // preventDefault might not exist in some environments (React Native e.g.)
    /* istanbul ignore next */
    // tslint:disable-next-line strict-type-predicates
    if (syntheticEvent && typeof syntheticEvent.preventDefault === 'function') {
      syntheticEvent.preventDefault()
    }

    app.dispatch(event)
  }

  const handleSubmit = handle(submit())
  const handleReset = handle(resetForm())

  return ({ children, render, component }) => {
    return (
      <Consumer mapState={formDataSelector}>
        {({ submitting, valid, ready, dirty, pristine }) =>
          renderComponent(
            {
              children,
              render,
              component
            },
            {
              handleSubmit,
              handleReset,
              submitting,
              valid,
              ready,
              dirty,
              pristine
            },
            'Form'
          )
        }
      </Consumer>
    )
  }
}
