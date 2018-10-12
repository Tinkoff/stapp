export const simpleMemoize = <A, R>(fn: (arg: A) => R): ((arg: A) => R) => {
  let lastResult: R | null = null
  let lastArg: A | null = null

  return (arg: A) => {
    if (arg === lastArg) {
      return lastResult as R
    }

    lastArg = arg

    return (lastResult = fn(arg))
  }
}
