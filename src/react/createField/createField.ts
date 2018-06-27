// tslint:disable-next-line no-unused-variable
import React, { createElement, SyntheticEvent } from 'react'
import { setActive, setTouched, setValue } from '../../modules/formBase/events'
import { FormBaseState } from '../../modules/formBase/formBase.h'
import { fieldSelector } from '../../modules/formBase/selectors'
import { createConsumer } from '../createConsumer/createConsumer'

// Models
import { Stapp } from '../../core/createApp/createApp.h'
import { renderComponent } from '../helpers/renderComponent'
import { FieldProps } from './createField.h'

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
 * @param app Stapp application
 */
export const createField = <State extends FormBaseState, Api>(app: Stapp<State, Api>) => {
  const Consumer = createConsumer(app)

  return <Extra>({
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
      mapState: fieldSelector(name, extraSelector),
      render: ({ value, error, dirty, touched, active, extra }: any) =>
        renderComponent(
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
          'Field'
        )
    })
  }
}
