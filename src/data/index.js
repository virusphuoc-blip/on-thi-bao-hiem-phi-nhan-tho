import questions from './questions.json'
import meoNho from './meoNho.json'

export { questions, meoNho }
// Câu đủ phương án để thi thử / ôn chủ đề (câu chỉ có đáp án đúng chỉ dùng cho flashcard, tìm kiếm)
export const practiceQuestions = questions.filter((q) => !q.thieuDapAn && !q.chiOnTap && Object.keys(q.dapAn).length >= 2)
export const questionById = Object.fromEntries(questions.map((q) => [q.id, q]))
