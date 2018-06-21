import {
  fieldSelector,
  formSelector,
  isDirtySelector,
  isPristineSelector,
  isReadySelector,
  isValidSelector
} from './selectors'

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

  test('isPristineSelector', () => {
    const selector = isPristineSelector()
    expect(selector({
      pristine: true
    })).toBe(true)

    expect(selector({
      pristine: false
    })).toBe(false)
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
  })

  test('formSelector', () => {
    const selector = formSelector()

    expect(selector({
      pristine: true,
      values: {
        test: 123
      },
      ready: {},
      errors: {
        test: null
      },
      dirty: {
        test: false
      },
      touched: {}
    })).toEqual({
      submitting: false,
      valid: true,
      ready: true,
      dirty: false,
      pristine: true
    })

    expect(selector({
      pristine: true,
      values: {
        test: 123
      },
      ready: {},
      errors: {
        test: 'test'
      },
      dirty: {
        test: false
      },
      touched: {}
    })).toEqual({
      submitting: false,
      valid: false,
      ready: true,
      dirty: false,
      pristine: true
    })

    expect(selector({
      pristine: false,
      values: {
        test: 123
      },
      ready: {},
      errors: {
        test: null
      },
      dirty: {
        test: false
      },
      touched: {}
    })).toEqual({
      submitting: false,
      valid: true,
      ready: true,
      dirty: false,
      pristine: false
    })
  })
})
