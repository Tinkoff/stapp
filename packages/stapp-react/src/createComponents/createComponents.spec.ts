import { createApp } from 'stapp'
import { formBase } from 'stapp-formbase'
import { uniqueId } from 'stapp/lib/helpers/uniqueId/uniqueId'
import { createComponents } from './createComponents'

describe('createComponents', () => {
  const getApp = () =>
    createApp({
      name: 'test' + uniqueId(),
      modules: [formBase()]
    })

  it('should return Consumer, consume, Form and Field as object', () => {
    const app = getApp()

    const { Consumer, consume, Form, Field } = createComponents(app)

    expect(Consumer).toBeTruthy()
    expect(consume).toBeTruthy()
    expect(Form).toBeTruthy()
    expect(Field).toBeTruthy()
  })
})
