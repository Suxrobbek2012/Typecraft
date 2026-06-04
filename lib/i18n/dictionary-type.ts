import type { DeepStringify } from './deep'
import { en } from './en'

export type Dictionary = DeepStringify<typeof en>
