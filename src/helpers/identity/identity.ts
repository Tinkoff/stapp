/**
 * Returns passed argument
 *
 * @param x The value to return.
 * @param other Ignored params
 * @return The input value
 * @private
 */
export const identity = <T>(x: T, ...other: any[]) => x
