/**
 * @private
 */
export const controlledPromise = <T>(): {
  promise: Promise<T>
  resolve: (value?: T) => void
} => {
  // Promise callback is called synchronously, so it's ok
  let resolve: any
  const promise = new Promise<T>((_resolve) => {
    resolve = (value?: T) => _resolve(value)
  })

  return {
    promise,
    resolve
  }
}
