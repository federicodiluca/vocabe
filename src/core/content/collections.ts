import type { ProgressState, Word } from '@/core/types'
import { getWord } from '@/core/content/words'
import raw from '@/data/collections.json'

/** A hand-curated path through the dictionary: words that belong together by sense. */
export type Collection = {
  id: string
  name: string
  description: string
  wordIds: string[]
}

export const COLLECTIONS = raw as Collection[]

const BY_ID = new Map(COLLECTIONS.map((c) => [c.id, c]))

export function getCollection(id: string): Collection | undefined {
  return BY_ID.get(id)
}

/** The words of a collection, in the order they were curated. */
export function collectionWords(c: Collection): Word[] {
  return c.wordIds.map(getWord).filter((w): w is Word => w !== undefined)
}

/** How many of the collection's words the reader has already learned. */
export function collectionProgress(c: Collection, learned: ProgressState['learned']): number {
  return c.wordIds.reduce((n, id) => n + (id in learned ? 1 : 0), 0)
}
