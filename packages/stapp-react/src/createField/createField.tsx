import React, { StatelessComponent, SyntheticEvent } from 'react'
import { setActive, setTouched, setValue } from 'stapp/lib/modules/formBase/events'
import { fieldSelector } from 'stapp/lib/modules/formBase/selectors'
import { createConsumer } from '../createConsumer/createConsumer'

// Models
import { Stapp } from 'stapp/lib/core/createApp/createApp.h'
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
export const createField = <State, Api>(app: Stapp<State, Api>): StatelessComponent<FieldProps> => {
  const Consumer = createConsumer(app)

  return ({ name, children, render, component }) => {
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

    return (
      <Consumer mapState={fieldSelector(name)}>
        {({ value, error, dirty, touched, active }) =>
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
              }
            },
            'Field'
          )
        }
      </Consumer>
    )
  }
}
