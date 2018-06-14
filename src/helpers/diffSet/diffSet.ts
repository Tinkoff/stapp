/**
 * Collects entries from a second set, that do not present in a first set
 * @param setA
 * @param setB
 * @returns New set comprising found entries
 * @private
 */
export const diffSet = <T>(setA: Set<T>, setB: Set<T>) => {
  const result = new Set()

  setB.forEach((entry) => setA.has(entry) || result.add(entry))

  return result
}
