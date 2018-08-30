import { mount } from 'enzyme'
import React from 'react'
import { createApp } from 'stapp'
import { formBase, submit } from 'stapp-formbase'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { createConsumer } from '../binded/createConsumer'
import { createField } from './createField'
import { createForm } from './createForm'

describe('createForm', () => {
  const app = createApp({
    name: 'test',
    modules: [loggerModule({ pattern: null }), formBase<{ test1: string }>()]
  })

  const last = (a: any[]) => a[a.length - 1]
  const Consumer = createConsumer(app)
  const Form = createForm(Consumer)
  const Field = createField(Consumer)

  const DummyForm = () => {
    return (
      <Form>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="test1">
              {({ input, meta }) => (
                <React.Fragment>
                  <input {...input} />
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </React.Fragment>
              )}
            </Field>
          </form>
        )}
      </Form>
    )
  }

  test('Form', () => {
    const mounted = mount(<DummyForm />)
    const input = mounted.find('input').first()
    const form = mounted.find('form').first()

    input.simulate('focus')
    expect(app.getState().active).toEqual('test1')

    input.simulate('blur')
    expect(app.getState().active).toEqual(null)
    expect(app.getState().touched.test1).toEqual(true)
    ;(input.instance() as any).value = 'test'
    input.simulate('change')
    expect(app.getState().values.test1).toEqual('test')

    form.simulate('submit')
    expect(last(app.getState().eventLog)).toEqual(
      expect.objectContaining(submit())
    )
  })
})
