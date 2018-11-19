import { observableConfig } from './observableConfig'

describe('observableConfig', function() {
  it('should do nothing', () => {
    const o = {} as any
    expect(observableConfig.fromESObservable(o)).toBe(o)
    expect(observableConfig.toESObservable(o)).toBe(o)
  })
})
