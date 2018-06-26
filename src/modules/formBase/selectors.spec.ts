import { FormBaseState } from './formBase.h'
import { fieldSelector, isDirtySelector, isReadySelector, isValidSelector } from './selectors'

describe('FormBase selectors', () => {
  test('isValidSelector', () => {
    const selector = isValidSelector()

    expect(
      selector({
        errors: {}
      })
    ).toEqual(true)

    expect(
      selector({
        errors: {
          test: 'some error'
        }
      })
    ).toEqual(false)
  })

  test('isReadySelector', () => {
    const selector = isReadySelector()

    expect(
      selector({
        ready: {}
      })
    ).toEqual(true)

    expect(
      selector({
        ready: {
          test: true
        }
      })
    ).toEqual(true)

    expect(
      selector({
        ready: {
          test: false
        }
      })
    ).toEqual(false)
  })

  test('isDirtySelector', () => {
    const selector = isDirtySelector()

    expect(
      selector({
        dirty: {}
      })
    ).toEqual(false)

    expect(
      selector({
        dirty: {
          test: true
        }
      })
    ).toEqual(true)

    expect(
      selector({
        dirty: {
          test: false
        }
      })
    ).toEqual(false)
  })

  test('fieldSelector', () => {
    expect(
      fieldSelector('test')({
        values: {
          test: 123
        },
        errors: {
          test: null
        },
        dirty: {
          test: false
        },
        touched: {}
      })
    ).toEqual({
      value: 123,
      error: null,
      touched: false,
      active: false,
      dirty: false
    })

    expect(
      fieldSelector('test')({
        values: {},
        errors: {
          test: 'Some error'
        },
        touched: {
          test: true
        },
        dirty: {
          test: true
        },
        active: 'test'
      })
    ).toEqual({
      value: undefined,
      error: 'Some error',
      touched: true,
      dirty: true,
      active: true
    })

    expect(
      fieldSelector<FormBaseState & { customValue: string }>(
        'test',
        ({ customValue }) => customValue
      )({
        values: {},
        errors: {
          test: 'Some error'
        },
        touched: {
          test: true
        },
        dirty: {
          test: true
        },
        active: 'test',
        customValue: 'Some custom value'
      })
    ).toEqual({
      value: undefined,
      error: 'Some error',
      touched: true,
      dirty: true,
      active: true,
      custom: 'Some custom value'
    })
  })
})
