/** Recursively widen string literals to `string` for translation files */
export type DeepStringify<T> = T extends readonly (infer U)[]
  ? readonly DeepStringify<U>[]
  : T extends object
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : string
