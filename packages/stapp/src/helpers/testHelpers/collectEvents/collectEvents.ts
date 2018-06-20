import { Observable } from 'rxjs/Observable'
import { scan } from 'rxjs/operators/scan'

/**
 * @private
 */
export const collectEvents = async <T>(stream: Observable<T>) =>
  stream.pipe(scan((r: T[], i: T) => r.concat(i), [])).toPromise()
