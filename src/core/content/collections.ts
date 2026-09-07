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

/**
 * Resolved once at load. Everything counts over *these* words rather than over
 * `wordIds`, so that a collection listing a word the dataset no longer has can
 * still be completed instead of stalling one short of a full bar.
 */
const WORDS_BY_ID = new Map(
  COLLECTIONS.map((c) => [c.id, c.wordIds.map(getWord).filter((w): w is Word => w !== undefined)]),
)

export function getCollection(id: string): Collection | undefined {
  return BY_ID.get(id)
}

/** The words of a collection, in the order they were curated. */
export function collectionWords(c: Collection): Word[] {
  return WORDS_BY_ID.get(c.id) ?? []
}

/** How many of the collection's words the reader has already learned. */
export function collectionProgress(c: Collection, learned: ProgressState['learned']): number {
  return collectionWords(c).reduce((n, w) => n + (w.id in learned ? 1 : 0), 0)
}

export function isCollectionComplete(
  c: Collection,
  learned: ProgressState['learned'],
): boolean {
  const words = collectionWords(c)
  return words.length > 0 && collectionProgress(c, learned) === words.length
}
