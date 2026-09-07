import { Preferences } from '@capacitor/preferences'
import { KEY, type StorageAdapter } from './store'

/** Reads the persisted blob once, before the app renders. */
export async function preloadNativeValue(): Promise<string | null> {
  const { value } = await Preferences.get({ key: KEY })
  return value
}

/**
 * Capacitor Preferences is async; the rest of the app expects a synchronous
 * adapter. Reads come from an in-memory cache seeded by `preloadNativeValue`,
 * writes update that cache immediately and persist to disk in the background.
 */
export function createNativeAdapter(initialValue: string | null): StorageAdapter {
  let cache = initialValue
  return {
    read: () => cache,
    write: (value) => {
      cache = value
      // A rejected write must not surface as an unhandled rejection: the cache
      // already holds the value, and the next write will try the disk again.
      void Preferences.set({ key: KEY, value }).catch(() => {})
    },
  }
}
