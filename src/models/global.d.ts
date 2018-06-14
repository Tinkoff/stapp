declare module 'fbjs/lib/invariant' {
  export default function invariant(condition: any, message: string): void
}

declare module 'fbjs/lib/shallowEqual' {
  export default function shallowEqual(objectA: any, objectB: any): boolean
}

declare module 'is-observable' {
  import { Observable } from 'rxjs/Observable'
  export default function isObservable(value: any): value is Observable<any>
}
