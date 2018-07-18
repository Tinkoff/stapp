import React from 'react'
import { Consumer, Field, Form } from '../apps/asyncForm'
import { createStructuredSelector } from 'reselect'
import { isLoadingSelector } from 'stapp-loaders'
import { isValidatingSelector } from 'stapp-validate'
import { RenderCount } from './RenderCount'
import { Spinner } from './Spinner'
import { Styles } from './Styles'

const isValidating = createStructuredSelector({
  isValidating: isValidatingSelector(),
  isLoading: isLoadingSelector()
})

export const App = () => {
  return <Styles>
    <h1>Stapp form example</h1>
    <h2>Asynchronous Field-Level Validation</h2>
    {/*<a href="https://github.com/erikras/react-final-form#-react-final-form">*/}
      {/*Read Docs*/}
    {/*</a>*/}
    <p>Usernames John, Paul, George or Ringo will fail async validation.</p>
    <p>Age less than 18 will fail sync validation.</p>
    <p>Empty fields will fail sync validation.</p>

    <h3>Using render prop pattern to avoid unnecessary re-render</h3>
    <Form>
      {
        ({ handleSubmit, handleReset, submitting }) => <form onSubmit={ handleSubmit }>
          <Consumer map={ isValidating }>
            {
              ({ isValidating, isLoading }) => (isValidating || isLoading) ? <Spinner /> : null
            }
          </Consumer>
          <Field name='username'>
            {
              ({ input, meta }) => <div>
                <label>Username</label>
                <input { ...input } type="text" placeholder="Username" />
                { meta.error && meta.touched && <span>{meta.error}</span> }
                <RenderCount/>
              </div>
            }
          </Field>
          <Field name='name'>
            {
              ({ input, meta }) => <div>
                <label>Last Name</label>
                <input { ...input } type="text" placeholder="Last Name" />
                { meta.error && meta.touched && <span>{meta.error}</span> }
                <RenderCount/>
              </div>
            }
          </Field>
          <Field name='age'>
            {
              ({ input, meta }) => <div>
                <label>Age</label>
                <input { ...input } type="number" placeholder="Age" />
                { meta.error && meta.touched && <span>{meta.error}</span> }
                <RenderCount/>
              </div>
            }
          </Field>

          <div className="buttons">
            <button
              type="submit"
              disabled={ submitting }>
              Submit
            </button>
            <button
              type="button"
              onClick={ handleReset }
              disabled={ submitting }
            >
              Reset
            </button>
          </div>

          <Consumer>
            {
              (state) => <pre>{ JSON.stringify(state, 0, 2) }</pre>
            }
          </Consumer>
        </form>
      }
    </Form>
  </Styles>
}
