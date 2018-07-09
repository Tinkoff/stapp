declare module 'fbjs/lib/invariant' {
  export default function invariant(condition: any, message: string): void
}

declare module 'fbjs/lib/shallowEqual' {
  export default function shallowEqual(objectA: any, objectB: any): boolean
}
