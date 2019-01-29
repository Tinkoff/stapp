import { mount } from 'enzyme'
import React from 'react'
import { createApp } from 'stapp'
import { formBase, submit } from 'stapp-formbase'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { createConsumer } from './createConsumer'
import { createField } from './createField'
import { createForm } from './createForm'

describe('createForm', () => {
  test('Form', () => {
    const app = createApp({
      name: 'test',
      modules: [
        loggerModule({ pattern: null }),
        formBase<{ test1: string; test2: string }>()
      ]
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

              <Field name="test2">
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

    const mounted = mount(<DummyForm />)
    const firstInput = mounted.find('input').first()
    const secondInput = mounted.find('input').last()
    const form = mounted.find('form').first()

    firstInput.simulate('focus')
    expect(app.getState().active).toEqual('test1')

    secondInput.simulate('blur')
    expect(app.getState().active).toEqual('test1')

    firstInput.simulate('blur')
    expect(app.getState().active).toEqual(null)
    expect(app.getState().touched.test1).toEqual(true)
    ;(firstInput.instance() as any).value = 'test'
    firstInput.simulate('change')
    expect(app.getState().values.test1).toEqual('test')

    form.simulate('submit')
    expect(last(app.getState().eventLog)).toEqual(
      expect.objectContaining(submit())
    )
  })

  it('should call preventDefault', () => {
    const app = createApp({
      name: 'test',
      modules: [loggerModule({ pattern: null }), formBase<{ test1: string }>()]
    })

    const Consumer = createConsumer(app)
    const Form = createForm(Consumer)

    const event = {
      preventDefault: jest.fn()
    }

    const Dummy = () => (
      <Form>
        {({ handleSubmit, handleReset }) => {
          handleSubmit(event as any)
          handleReset(event as any)
          return <div />
        }}
      </Form>
    )

    mount(<Dummy />)

    expect(event.preventDefault).toHaveBeenCalledTimes(2)
  })
})
