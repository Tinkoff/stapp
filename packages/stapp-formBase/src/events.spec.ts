import { submit } from './events'

describe('formBase', () => {
  test('submit event should always have empty payload', () => {
    expect(submit().payload).toEqual(undefined)

    // @ts-ignore
    expect(submit({ test: 123 }).payload).toEqual(undefined)

    // @ts-ignore
    expect(submit(123).payload).toEqual(undefined)
  })
})
