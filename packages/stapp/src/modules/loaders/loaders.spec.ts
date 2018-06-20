import { getInitialState } from '../../helpers/testHelpers/getInitialState/getInitialState'
import { isLoadingSelector, loaderEnd, loaders, loaderStart } from './loaders'

test('loaders module', () => {
  const loadersReducer = loaders().state!.loaders
  const initialState = getInitialState(loadersReducer)
  const selector = isLoadingSelector()

  const nextState1 = loadersReducer(initialState, loaderStart('test'))
  expect(nextState1).toEqual({
    test: true
  })
  expect(selector({ loaders: nextState1 })).toEqual(true)
  expect(loadersReducer(nextState1, loaderStart('test'))).toBe(nextState1)

  const nextState2 = loadersReducer(nextState1, loaderEnd('test'))
  expect(nextState2).toEqual({
    test: false
  })
  expect(selector({ loaders: nextState2 })).toEqual(false)
  expect(loadersReducer(nextState2, loaderEnd('test'))).toBe(nextState2)
})
