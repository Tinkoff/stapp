/**
 * Checks if provided argument is an array
 * @param a
 * @returns
 * @private
 */
export const isArray = <T>(a: any): a is T[] =>
  Object.prototype.toString.call(a) === '[object Array]'
