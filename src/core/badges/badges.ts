import type { ProgressState } from '@/core/types'
import { COLLECTIONS, isCollectionComplete } from '@/core/content/collections'

export type Badge = {
  id: string
  name: string
  hint: string
  /** returns true once the badge is earned */
  earned: (s: ProgressState) => boolean
}

const learnedCount = (s: ProgressState) => Object.keys(s.learned).length
const masteredCount = (s: ProgressState) =>
  Object.values(s.learned).filter((e) => e.box >= 5).length
const completedCollections = (s: ProgressState) =>
  COLLECTIONS.filter((c) => isCollectionComplete(c, s.learned)).length

export const BADGES: Badge[] = [
  { id: 'first-word', name: 'Prima parola', hint: 'Impara la tua prima parola', earned: (s) => learnedCount(s) >= 1 },
  { id: 'apprendista', name: 'Apprendista lessicale', hint: 'Impara 10 parole', earned: (s) => learnedCount(s) >= 10 },
  { id: 'eloquente', name: 'Eloquente', hint: 'Impara 50 parole', earned: (s) => learnedCount(s) >= 50 },
  { id: 'saggio', name: 'Saggio', hint: 'Impara 100 parole', earned: (s) => learnedCount(s) >= 100 },
  { id: 'streak-7', name: 'Una settimana', hint: '7 giorni consecutivi', earned: (s) => s.streak.longest >= 7 },
  { id: 'streak-30', name: 'Un mese intero', hint: '30 giorni consecutivi', earned: (s) => s.streak.longest >= 30 },
  { id: 'memoria-ferrea', name: 'Memoria ferrea', hint: 'Padroneggia 20 parole ai ripassi', earned: (s) => masteredCount(s) >= 20 },
  { id: 'raccolta-1', name: 'Collezionista', hint: 'Completa una raccolta', earned: (s) => completedCollections(s) >= 1 },
  { id: 'raccolta-3', name: 'Scaffale pieno', hint: 'Completa tre raccolte', earned: (s) => completedCollections(s) >= 3 },
]

/** Returns the newly earned badge ids given the current state. */
export function evaluateBadges(state: ProgressState): string[] {
  const have = new Set(state.badges)
  return BADGES.filter((b) => !have.has(b.id) && b.earned(state)).map((b) => b.id)
}

export function badge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}
