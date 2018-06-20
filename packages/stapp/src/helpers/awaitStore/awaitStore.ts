/**
 * @private
 */
const promises: Array<Promise<any>> = []

/**
 * @private
 */
const names: string[] = []

/**
 * @private
 * @param {string} name
 * @param {Promise<any>} promise
 */
export const awaitStore = (name: string, promise: Promise<any>) => {
  promises.push(promise)
  names.push(name)
}

/**
 * Returns promise, that resolves when all stores are ready. Primarily used for SSR.
 */
export const whenReady = () =>
  Promise.all(promises).then((results) =>
    names.reduce((result: { [K: string]: any }, name, index) => {
      result[name] = results[index]

      return result
    }, {})
  )
