/**
 * @private
 */
export const mergeIfChanged = <T, K extends keyof T>(o: T, n: Partial<T>) => {
  const keys = Object.keys(n) as K[]
  const changedFields = keys.filter((field) => o[field] !== n[field])

  return changedFields.length !== 0 ? Object.assign({}, o, n) : o
}

/**
 * @private
 */
export const replace = <P>(_: any, payload: P) => payload

/**
 * @private
 */
export const mapObject = <T, R, O extends { [K: string]: T }>(
  fn: (element: T, key: string, index: number) => R,
  obj: O
): { [K in keyof O]: R } => {
  return Object.keys(obj).reduce(
    (result, key, index) => {
      result[key] = fn(obj[key], key, index)
      return result
    },
    {} as any
  )
}
