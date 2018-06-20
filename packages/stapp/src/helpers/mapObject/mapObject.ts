/**
 * @private
 */
export const mapObject = <El, Result>(
  fn: (el: El, key: string, index: number) => Result,
  o: { [K: string]: El }
): { [K: string]: El } => {
  return Object.keys(o).reduce(
    (result, key, index) => {
      result[key] = fn(o[key], key, index)
      return result
    },
    {} as any
  )
}
