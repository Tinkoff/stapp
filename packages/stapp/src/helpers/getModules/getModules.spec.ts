import { getModules } from './getModules'

describe('getModules', () => {
  it('should get getModules from modules', () => {
    const moduleA = { name: 'testA' }
    const moduleB = () => ({ name: 'testB' })
    const moduleC = () => ({ name: 'testC' })

    expect(getModules([moduleA, moduleB, moduleC], {})).toEqual([
      { name: 'testA' },
      { name: 'testB' },
      { name: 'testC' }
    ])
  })

  it('should call module factory with passed extraArgument', () => {
    const module = jest.fn()
    module.mockReturnValue({ name: 'test' })

    const extraValue = { test: 123 }

    getModules([module], extraValue)

    expect(module).toBeCalledWith(extraValue)
  })

  it("should throw if passed module doesn't have a name", () => {
    const module = {}
    const moduleFactory = () => ({})

    expect(() => getModules([module as any], {})).toThrow()
    expect(() => getModules([moduleFactory], {})).toThrow()
  })

  it('should check dependencies', () => {
    const moduleA = {
      name: 'testA',
      dependencies: ['testB']
    }

    const moduleB = {
      name: 'testB',
      dependencies: ['testC']
    }

    const circular = {
      name: 'testC',
      dependencies: ['testA', 'testB']
    }

    expect(() => getModules([moduleA, moduleB], {})).toThrow()
    expect(() => getModules([moduleA, moduleB, circular], {})).not.toThrow()
  })

  it('should return empty list, if no modules provided', () => {
    expect(getModules(undefined, {})).toEqual([])
  })
})
