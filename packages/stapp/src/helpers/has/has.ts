/**
 * Returns whether or not an object has an own property with the specified name
 *
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @private
 */
export const has = <P extends string, O extends { [K in P]: any }>(prop: P, obj: any): obj is O =>
  obj != null && Object.prototype.hasOwnProperty.call(obj, prop)
