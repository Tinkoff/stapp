import { FluxStandardAction } from 'flux-standard-action'
import { Observable } from 'light-observable'
import { EMPTY } from 'light-observable/observable'
import { identity } from '../../helpers/identity/identity'
import { collectData } from '../../helpers/testHelpers/collectData/collectData'
import { createEvent } from './createEvent'

describe('createEvent', () => {
  let firstEvent: any
  let secondEvent: any

  function testEventCreator(eventCreator: any) {
    expect(typeof eventCreator).toBe('function')
    expect(typeof eventCreator.getType).toBe('function')
  }

  function testEvent(
    event: FluxStandardAction<any, any>,
    payload: any,
    description?: string,
    meta?: any,
    isError?: boolean
  ) {
    expect(typeof event).toBe('object')

    // Type
    expect(event).toHaveProperty('type')
    expect(typeof event.type).toBe('string')
    if (typeof description === 'string') {
      expect(event.type.includes(description)).toBeTruthy()
    }

    // Payload
    expect(event).toHaveProperty('payload')
    expect(event.payload).toEqual(payload)

    // Meta
    if (typeof meta !== 'undefined') {
      expect(event).toHaveProperty('meta')
      expect(event.meta).toEqual(meta)
    }

    // Error
    expect(event).toHaveProperty('error')
    expect(event.error).toBe(isError === true)
  }

  it('should create one event creator', () => {
    firstEvent = createEvent()
    testEventCreator(firstEvent)
  })

  it('should return a valid event', () => {
    const event = firstEvent(42)
    testEvent(event, 42)
  })

  it('should return a valid event again', () => {
    const event = firstEvent('a string')
    testEvent(event, 'a string')
  })

  it('should create a second event creator', () => {
    secondEvent = createEvent(
      'second event',
      (one: any, two: any, three: any) => ({
        one,
        two,
        three: three.join(', ')
      })
    )
    testEventCreator(secondEvent)
  })

  it('should return a valid second event', () => {
    const event = secondEvent(111, 'test', [1, 'a', true])
    testEvent(
      event,
      { one: 111, two: 'test', three: '1, a, true' },
      'second event'
    )
  })

  it('should return a valid second event again', () => {
    const event = secondEvent(true, 222, ['a', 'b', 'c', 'd'])
    testEvent(
      event,
      { one: true, two: 222, three: 'a, b, c, d' },
      'second event'
    )
  })

  it('should add error key', () => {
    const error = new Error('Simple error')
    const event = createEvent<any>()
    const eventWithPayload = createEvent('', (value: any) => {
      if (value === 'error') {
        return error
      }
      return value
    })

    const eventWithMeta = createEvent(
      '',
      (x: any) => x,
      (x) => ({ more: true, content: x })
    )

    const errorEvent = event(error)
    const errorEventPayload = eventWithPayload('error')
    const errorEventMeta = eventWithMeta(error)

    testEvent(errorEvent, error, undefined, undefined, true)
    testEvent(errorEventPayload, error, undefined, undefined, true)
    testEvent(
      errorEventMeta,
      error,
      undefined,
      { more: true, content: error },
      true
    )
  })

  it('should add error, if payload transformer throws', () => {
    const error = new Error()
    const event = createEvent('', () => {
      throw error
    })

    const errorEvent = event()

    testEvent(errorEvent, error, undefined, undefined, true)
  })

  it('returns type of an event', () => {
    const eventCreator = createEvent()

    expect(eventCreator.getType()).toEqual(eventCreator().type)
  })

  it('checks if provided event is of event creator type', () => {
    const a = createEvent()
    const b = createEvent()
    const eventA = a()
    const eventB = b()

    expect(a.is(eventA)).toBe(true)
    expect(a.is(eventB)).toBe(false)
  })

  it('should create a filtered epic', async () => {
    const a = createEvent()
    const b = createEvent()
    const aEpic = a.epic((event$) => event$)
    const events$ = Observable.of(a(), b(), {})
    const result = await collectData(
      aEpic(events$, EMPTY, {
        getState: () => ({}),
        dispatch: (x: any) => x,
        fromESObservable: identity,
        toESObservable: identity
      } as any)
    )

    expect(result).toEqual([a()])
  })
})
