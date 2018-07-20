export const isPromise = (maybePromise: any): maybePromise is Promise<any> =>
  typeof maybePromise === 'object' &&
  maybePromise != null &&
  typeof maybePromise.then === 'function'
