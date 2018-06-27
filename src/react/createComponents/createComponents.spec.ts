import { createApp } from '../../core/createApp/createApp'
import { createReducer } from '../../core/createReducer/createReducer'
import { uniqueId } from '../../helpers/uniqueId/uniqueId'
import { createComponents } from './createComponents'

describe('createComponents', () => {
  const getApp = () =>
    createApp({
      name: 'test' + uniqueId(),
      modules: [
        {
          name: 'test',
          reducers: {
            r: createReducer(null)
          }
        }
      ]
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
