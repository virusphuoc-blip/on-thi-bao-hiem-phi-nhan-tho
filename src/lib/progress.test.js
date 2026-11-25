import { describe, expect, it } from 'vitest'
import { addHistory, emptyState, loadState, recordAnswer, saveState, setFlash, toggleHard } from './progress.js'

describe('progress', () => {
  it('tracks wrong list and removes after 2 consecutive correct', () => {
    let s = recordAnswer(emptyState(), 'q', false)
    expect(s.wrong).toEqual({ q: 0 })
    s = recordAnswer(s, 'q', true)
    expect(s.wrong).toEqual({ q: 1 })
    s = recordAnswer(s, 'q', false)
    expect(s.wrong).toEqual({ q: 0 })
    s = recordAnswer(recordAnswer(s, 'q', true), 'q', true)
    expect(s.wrong).toEqual({})
    expect(s.answers.q).toEqual({ n: 5, c: 3, last: true })
  })
  it('correct answers never add to wrong list', () => {
    expect(recordAnswer(emptyState(), 'x', true).wrong).toEqual({})
  })
  it('toggles hard, flash and history', () => {
    let s = toggleHard(emptyState(), 'a')
    expect(s.hard).toEqual(['a'])
    expect(toggleHard(s, 'a').hard).toEqual([])
    s = setFlash(s, 'a', 'chua')
    expect(s.flash.a).toBe('chua')
    s = addHistory(addHistory(s, { id: '1' }), { id: '2' })
    expect(s.history.map((h) => h.id)).toEqual(['2', '1'])
  })
  it('round-trips through storage and survives bad data', () => {
    const mem = { v: {}, getItem(k) { return this.v[k] ?? null }, setItem(k, x) { this.v[k] = x } }
    saveState(recordAnswer(emptyState(), 'q', false), mem)
    expect(loadState(mem).wrong).toEqual({ q: 0 })
    mem.v['otbh-pnt-v1'] = '{bad'
    expect(loadState(mem)).toEqual(emptyState())
  })
})
