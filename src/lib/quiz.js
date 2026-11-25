import { TOPICS } from '../data/topics.js'

export const OPTION_KEYS = ['A', 'B', 'C', 'D']

export function normalizeText(s) {
  return String(s ?? '').normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim()
}

export function foldText(s) {
  return normalizeText(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
}

export function shuffle(arr, rand = Math.random) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function deOf(q) {
  return q.cacDe && q.cacDe.length ? q.cacDe : [q.de]
}

function deSortKey(name) {
  const m = String(name).match(/(\d+)/)
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER
}

export function compareDe(a, b) {
  return deSortKey(a) - deSortKey(b) || String(a).localeCompare(String(b), 'vi')
}

export function examList(questions) {
  const counts = new Map()
  for (const q of questions) for (const de of deOf(q)) counts.set(de, (counts.get(de) || 0) + 1)
  return [...counts.entries()].map(([de, count]) => ({ de, count })).sort((x, y) => compareDe(x.de, y.de))
}

export function questionsOfDe(questions, de) {
  return questions.filter((q) => deOf(q).includes(de))
}

export function buildExam(questions, de, count, rand = Math.random) {
  if (de) {
    return { title: de, qids: questionsOfDe(questions, de).slice(0, count).map((q) => q.id) }
  }
  return { title: 'Đề ngẫu nhiên', qids: shuffle(questions, rand).slice(0, count).map((q) => q.id) }
}

export function passThreshold(total, passPercent) {
  return Math.ceil((total * passPercent) / 100)
}

export function percent(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0
}

export function gradeExam(questionById, qids, picks, passPercent) {
  let correct = 0
  const wrongQids = []
  for (const id of qids) {
    if (picks[id] && picks[id] === questionById[id]?.dapAnDung) correct++
    else wrongQids.push(id)
  }
  const total = qids.length
  return {
    total,
    correct,
    percent: percent(correct, total),
    pass: total > 0 && correct >= passThreshold(total, passPercent),
    wrongQids,
  }
}

export function overallStats(answers) {
  let attempts = 0
  let correct = 0
  let answeredQ = 0
  for (const a of Object.values(answers)) {
    answeredQ++
    attempts += a.n
    correct += a.c
  }
  return { answeredQ, attempts, correct, percent: percent(correct, attempts) }
}

export function topicStats(questions, answers) {
  const res = Object.fromEntries(
    TOPICS.map((t) => [t.id, { total: 0, answeredQ: 0, attempts: 0, correct: 0, percent: 0 }]),
  )
  for (const q of questions) {
    const s = res[q.chuDe]
    if (!s) continue
    s.total++
    const a = answers[q.id]
    if (a) {
      s.answeredQ++
      s.attempts += a.n
      s.correct += a.c
    }
  }
  for (const s of Object.values(res)) s.percent = percent(s.correct, s.attempts)
  return res
}

export function weakestTopic(stats, answeredQ, minAnswered) {
  if (answeredQ < minAnswered) return null
  let best = null
  for (const t of TOPICS) {
    const s = stats[t.id]
    if (!s || !s.attempts) continue
    if (!best || s.percent < best.stats.percent) best = { topic: t, stats: s }
  }
  return best
}

export function searchQuestions(questions, query, limit = 50) {
  const terms = foldText(query).split(' ').filter(Boolean)
  if (!terms.length) return []
  const out = []
  for (const q of questions) {
    const text = foldText(q.cauHoi)
    if (terms.every((t) => text.includes(t))) {
      out.push(q)
      if (out.length >= limit) break
    }
  }
  return out
}
