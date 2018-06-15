/**
 * @private
 */
export type ObjectKey = string | number | symbol

/**
 * @private
 */
export type Diff<T extends ObjectKey, U extends ObjectKey> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

/**
 * @private
 */
export type Omit<T, K extends ObjectKey> = { [P in Diff<keyof T, K>]: T[P] }
