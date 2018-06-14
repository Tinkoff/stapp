/* istanbul ignore next */
export const logError = (nameSpace: string, error: any) => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line no-console
    console.error(`${nameSpace} error:`, error)
  }
}
