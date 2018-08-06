import { has } from '../../helpers/has/has'

export const pick = <T, K extends keyof T>(obj: T, props: K[]): Pick<T, K> => {
  const result: { [K: string]: any } = {}

  for (const key of props) {
    if (has(key as string, obj)) {
      result[key as string] = obj[key]
    }
  }

  return result as Pick<T, K>
}
