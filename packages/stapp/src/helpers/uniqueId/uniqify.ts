import { uniqueId } from './uniqueId'

const uniqueSet = new Set<string>()

export const uniqify = (id?: string) => {
  if (!id) {
    return `[${uniqueId()}]`
  }

  if (uniqueSet.has(id)) {
    return `${id} [${uniqueId()}]`
  }

  uniqueSet.add(id)
  return id
}
