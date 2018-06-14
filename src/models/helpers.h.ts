/**
 * @private
 */
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

/**
 * @private
 */
export type Omit<T, K extends string> = { [P in Diff<keyof T, K>]: T[P] }
