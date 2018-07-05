import { isArray } from './isArray'

it('should check if provided value is an array', () => {
  expect(isArray([])).toBe(true)
  expect(isArray(123)).toBe(false)
  expect(isArray(NaN)).toBe(false)
  expect(isArray('100')).toBe(false)
  expect(isArray('test')).toBe(false)
  expect(isArray(() => undefined)).toBe(false)
})
