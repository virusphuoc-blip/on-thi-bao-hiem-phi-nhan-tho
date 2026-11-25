import { HISTORY_LIMIT, WRONG_REMOVE_STREAK } from '../config.js'

export const STORAGE_KEY = 'otbh-pnt-v1'
export const EXAM_KEY = 'otbh-pnt-exam'

export function emptyState() {
  // answers: { [qid]: { n: số lần làm, c: số lần đúng, last: đúng/sai lần cuối } }
  // wrong: { [qid]: số lần đúng liên tiếp kể từ lần sai gần nhất }
  // hard: [qid] câu đánh dấu khó; flash: { [qid]: 'nho' | 'chua' }
  return { answers: {}, wrong: {}, hard: [], flash: {}, history: [] }
}

export function loadState(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    return raw ? { ...emptyState(), ...JSON.parse(raw) } : emptyState()
  } catch {
    return emptyState()
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // bộ nhớ đầy hoặc bị chặn: bỏ qua
  }
}

export function recordAnswer(state, qid, isCorrect) {
  const prev = state.answers[qid] || { n: 0, c: 0 }
  const answers = { ...state.answers, [qid]: { n: prev.n + 1, c: prev.c + (isCorrect ? 1 : 0), last: isCorrect } }
  const wrong = { ...state.wrong }
  if (!isCorrect) wrong[qid] = 0
  else if (qid in wrong) {
    wrong[qid] += 1
    if (wrong[qid] >= WRONG_REMOVE_STREAK) delete wrong[qid]
  }
  return { ...state, answers, wrong }
}

export function recordAnswers(state, results) {
  return results.reduce((s, [qid, ok]) => recordAnswer(s, qid, ok), state)
}

export function toggleHard(state, qid) {
  const hard = state.hard.includes(qid) ? state.hard.filter((x) => x !== qid) : [...state.hard, qid]
  return { ...state, hard }
}

export function setFlash(state, qid, value) {
  return { ...state, flash: { ...state.flash, [qid]: value } }
}

export function addHistory(state, entry) {
  return { ...state, history: [entry, ...state.history].slice(0, HISTORY_LIMIT) }
}

export function loadExam(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(EXAM_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveExam(exam, storage = globalThis.localStorage) {
  try {
    if (exam) storage?.setItem(EXAM_KEY, JSON.stringify(exam))
    else storage?.removeItem(EXAM_KEY)
  } catch {
    // bỏ qua
  }
}
