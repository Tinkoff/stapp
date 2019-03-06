interface ClearablePromise<T> extends Promise<T> {
  clear(): void
}

export const wait = <T = never>(
  ms: number,
  value?: T,
  error?: any
): ClearablePromise<T> => {
  let timeoutId: any
  let settle: any

  const delayPromise: any = new Promise((resolve, reject) => {
    settle = typeof error !== 'undefined' ? reject : resolve
    timeoutId = setTimeout(
      settle,
      ms,
      typeof error !== 'undefined' ? error : value
    )
  })

  delayPromise.clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      settle(value)
    }
  }

  return delayPromise as ClearablePromise<T>
}
