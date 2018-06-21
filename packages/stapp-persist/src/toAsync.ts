import { AsyncStorage } from './persist.h'

/**
 * Converts synchronous storage into asynchronous
 * @param storage any localStorage or sessionStorage compatible object
 * @returns {AsyncStorage}
 */
export const toAsync = (storage: {
  getItem: (key: string) => any
  setItem: (key: string, data: string) => any
  removeItem: (key: string) => void
}): AsyncStorage => ({
  getItem(key) {
    return Promise.resolve(storage.getItem(key))
  },
  setItem(key, data) {
    return Promise.resolve(storage.setItem(key, data))
  },
  removeItem(key) {
    return Promise.resolve(storage.removeItem(key))
  }
})
