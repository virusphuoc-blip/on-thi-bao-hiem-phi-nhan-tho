import questions from './questions.json'
import meoNho from './meoNho.json'

export { questions, meoNho }
export const questionById = Object.fromEntries(questions.map((q) => [q.id, q]))
