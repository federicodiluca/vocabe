import { describe, expect, it } from 'vitest'
import { buildQuiz, makeQuestion, posFamily, QUIZ_LENGTH, INVERSE_FROM_BOX } from './quiz'
import { WORDS, getWord } from './content/words'

/** Deterministic stand-in for Math.random so option order is reproducible. */
function seededRng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const word = WORDS.find((w) => w.category === 'letteraria' && w.difficulty === 3)!

describe('makeQuestion', () => {
  it('asks for the meaning in the forward direction', () => {
    const q = makeQuestion(word, 'forward', seededRng())
    expect(q.prompt).toBe(word.term)
    expect(q.options).toHaveLength(4)
    expect(q.options[q.answer]).toBe(word.meaning)
  })

  it('asks for the word in the inverse direction', () => {
    const q = makeQuestion(word, 'inverse', seededRng())
    expect(q.prompt).toBe(word.meaning)
    expect(q.options[q.answer]).toBe(word.term)
  })

  it('never offers the same option twice', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const q = makeQuestion(WORDS[seed % WORDS.length], 'forward', seededRng(seed))
      expect(new Set(q.options).size).toBe(q.options.length)
    }
  })

  it('draws distractors from the same category when it can', () => {
    const q = makeQuestion(word, 'inverse', seededRng(7))
    const distractors = q.options.filter((o) => o !== word.term).map((o) => WORDS.find((w) => w.term === o)!)
    expect(distractors.every((w) => w.category === word.category)).toBe(true)
  })
})

describe('distractors and part of speech', () => {
  const byTerm = new Map(WORDS.map((w) => [w.term, w]))
  const byMeaning = new Map(WORDS.map((w) => [w.meaning, w]))

  it('never offers a definition of another part of speech (whole dataset, forward)', () => {
    const rng = seededRng(3)
    const offenders: string[] = []
    for (const w of WORDS) {
      const q = makeQuestion(w, 'forward', rng)
      for (const opt of q.options) {
        const other = byMeaning.get(opt)!
        if (posFamily(other.pos) !== posFamily(w.pos) && posFamily(w.pos) !== 'altro') {
          offenders.push(`${w.term} (${w.pos}) ← ${other.term} (${other.pos})`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('never offers a term of another part of speech (whole dataset, inverse)', () => {
    const rng = seededRng(4)
    const offenders: string[] = []
    for (const w of WORDS) {
      const q = makeQuestion(w, 'inverse', rng)
      for (const opt of q.options) {
        const other = byTerm.get(opt)!
        if (posFamily(other.pos) !== posFamily(w.pos) && posFamily(w.pos) !== 'altro') {
          offenders.push(`${w.term} (${w.pos}) ← ${other.term} (${other.pos})`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('folds verb, noun and adjective subtypes into one family each', () => {
    expect(posFamily('v.tr.')).toBe(posFamily('v.intr.'))
    expect(posFamily('v.rifl.')).toBe('verbo')
    expect(posFamily('s.m.')).toBe(posFamily('s.f.'))
    expect(posFamily('s.m./f.')).toBe('nome')
    expect(posFamily('agg.')).toBe('aggettivo')
    expect(posFamily('avv.')).toBe('altro')
    expect(posFamily(undefined)).toBe('altro')
  })
})

describe('buildQuiz', () => {
  const due = WORDS.slice(0, 20).map((w, i) => ({ id: w.id, box: i < 10 ? 1 : 4 }))

  it('caps the round length', () => {
    expect(buildQuiz(due, seededRng())).toHaveLength(QUIZ_LENGTH)
  })

  it('returns nothing when nothing is due', () => {
    expect(buildQuiz([], seededRng())).toEqual([])
  })

  it('uses the inverse direction only for well-known words', () => {
    for (const q of buildQuiz(due, seededRng(3))) {
      const box = due.find((d) => d.id === q.word.id)!.box
      expect(q.direction).toBe(box >= INVERSE_FROM_BOX ? 'inverse' : 'forward')
    }
  })

  it('skips ids that are not in the dataset', () => {
    const quiz = buildQuiz([{ id: 'parola-inventata', box: 1 }], seededRng())
    expect(quiz).toEqual([])
    expect(getWord('parola-inventata')).toBeUndefined()
  })
})
