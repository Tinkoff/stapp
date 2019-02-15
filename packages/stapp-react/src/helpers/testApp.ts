import { createApp, createEvent, createReducer } from 'stapp'
import { formBase } from 'stapp-formbase'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'

const inc = createEvent()
const dec = createEvent()
const testModule = {
  name: 'test',
  state: {
    counter: createReducer(0)
      .on(inc, (s) => s + 1)
      .on(dec, (s) => s - 1)
  },
  api: {
    inc,
    dec
  }
}

/**
 * @private
 */
export const getApp = () =>
  createApp({
    name: 'test',
    modules: [
      loggerModule({ pattern: undefined }),
      formBase<{ test1: string }>({
        initialValues: {
          test1: '1'
        }
      }),
      testModule
    ]
  })
