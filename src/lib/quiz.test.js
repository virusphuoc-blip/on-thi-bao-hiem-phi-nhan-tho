import { describe, expect, it } from 'vitest'
import { buildExam, examList, gradeExam, overallStats, passThreshold, searchQuestions, topicStats, weakestTopic } from './quiz.js'

const mk = (id, de, chuDe, dapAnDung, cauHoi = `Câu ${id}`) => ({
  id, de, cacDe: [de], chuDe, cauHoi, dapAn: { A: 'a', B: 'b', C: 'c', D: 'd' }, dapAnDung,
})
const qs = [mk('1', 'Đề 2', 1, 'A', 'Thời gian chờ bảo hiểm'), mk('2', 'Đề 10', 2, 'B'), mk('3', 'Đề 2', 2, 'C'), mk('4', 'Đề 1', 3, 'D')]
const byId = Object.fromEntries(qs.map((q) => [q.id, q]))

describe('quiz', () => {
  it('sorts exams naturally', () => {
    expect(examList(qs).map((e) => e.de)).toEqual(['Đề 1', 'Đề 2', 'Đề 10'])
  })
  it('builds exam from a đề or randomly', () => {
    expect(buildExam(qs, 'Đề 2', 40).qids).toEqual(['1', '3'])
    const r = buildExam(qs, null, 3, () => 0.5)
    expect(r.qids).toHaveLength(3)
    expect(new Set(r.qids).size).toBe(3)
  })
  it('grades with 70% threshold = 28/40', () => {
    expect(passThreshold(40, 70)).toBe(28)
    const g = gradeExam(byId, ['1', '2', '3', '4'], { 1: 'A', 2: 'B', 3: 'C', 4: 'A' }, 70)
    expect(g).toMatchObject({ total: 4, correct: 3, percent: 75, pass: true, wrongQids: ['4'] })
    expect(gradeExam(byId, ['1', '2'], { 1: 'A' }, 70).pass).toBe(false)
  })
  it('computes stats and weakest topic', () => {
    const answers = { 1: { n: 2, c: 2 }, 2: { n: 1, c: 0 }, 3: { n: 1, c: 1 } }
    expect(overallStats(answers)).toMatchObject({ answeredQ: 3, attempts: 4, correct: 3, percent: 75 })
    const s = topicStats(qs, answers)
    expect(s[2]).toMatchObject({ total: 2, answeredQ: 2, percent: 50 })
    expect(weakestTopic(s, 3, 10)).toBeNull()
    expect(weakestTopic(s, 10, 10).topic.id).toBe(2)
  })
  it('searches ignoring diacritics and case', () => {
    expect(searchQuestions(qs, 'thoi gian CHO').map((q) => q.id)).toEqual(['1'])
    expect(searchQuestions(qs, '  ')).toEqual([])
  })
})
