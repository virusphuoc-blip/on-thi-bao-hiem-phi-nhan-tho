import { useState } from 'react'
import { questions as allQuestions, questionById } from '../data/index.js'
import { TOPICS } from '../data/topics.js'
import { shuffle } from '../lib/quiz.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import useTitle from '../lib/useTitle.js'

const questions = allQuestions.filter((q) => q.dapAnDung)

function deckFor(filter, state) {
  if (filter === 'chua') return questions.filter((q) => state.flash[q.id] === 'chua')
  if (filter === 'kho') return questions.filter((q) => state.hard.includes(q.id))
  if (filter === 'all') return questions
  return questions.filter((q) => q.chuDe === Number(filter))
}

export default function Flashcards() {
  useTitle('Flashcard')
  const { state, setFlash } = useProgress()
  const [filter, setFilter] = useState('all')
  const [mix, setMix] = useState(false)
  const [queue, setQueue] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const [learned, setLearned] = useState(0)

  const chuaCount = Object.values(state.flash).filter((v) => v === 'chua').length
  const nhoCount = Object.values(state.flash).filter((v) => v === 'nho').length

  function start() {
    const deck = deckFor(filter, state).map((q) => q.id)
    setQueue(mix ? shuffle(deck) : deck)
    setFlipped(false)
    setLearned(0)
  }

  if (!queue) {
    const size = deckFor(filter, state).length
    return (
      <div>
        <h1 className="h1">Flashcard</h1>
        <p className="muted">
          Đã nhớ {nhoCount} thẻ · Chưa nhớ {chuaCount} thẻ
        </p>
        <label className="field">
          <span>Chọn bộ thẻ</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tất cả câu hỏi</option>
            <option value="chua">Chỉ thẻ “Chưa nhớ” ({chuaCount})</option>
            <option value="kho">Chỉ câu đánh dấu khó ({state.hard.length})</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id}. {t.ngan}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={mix} onChange={(e) => setMix(e.target.checked)} /> Trộn thứ tự thẻ
        </label>
        <button type="button" className="btn block" disabled={!size} onClick={start}>
          Bắt đầu ({size} thẻ)
        </button>
      </div>
    )
  }

  if (!queue.length) {
    return (
      <div className="card">
        <h1 className="h2">Hết lượt!</h1>
        <p>Bạn đã nhớ {learned} thẻ trong lượt này.</p>
        <button type="button" className="btn block" onClick={() => setQueue(null)}>
          Chọn bộ thẻ khác
        </button>
      </div>
    )
  }

  const q = questionById[queue[0]]
  function mark(v) {
    setFlash(q.id, v)
    setFlipped(false)
    if (v === 'nho') {
      setLearned(learned + 1)
      setQueue(queue.slice(1))
    } else {
      setQueue([...queue.slice(1), q.id])
    }
  }

  return (
    <div>
      <div className="row space">
        <span className="muted">Còn {queue.length} thẻ</span>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => setQueue(null)}>
          Dừng
        </button>
      </div>
      <button
        type="button"
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? 'Mặt sau: đáp án' : 'Mặt trước: câu hỏi. Bấm để lật'}
      >
        {!flipped ? (
          <>
            <span className="fc-side">Câu hỏi</span>
            <span className="fc-text">{q.cauHoi}</span>
            <span className="muted small">Bấm để lật thẻ</span>
          </>
        ) : (
          <>
            <span className="fc-side">Đáp án đúng</span>
            <span className="fc-text">
              {q.thieuDapAn ? '' : `${q.dapAnDung}. `}
              {q.dapAn?.[q.dapAnDung]}
            </span>
            {q.giaiThich && <span className="small">{q.giaiThich}</span>}
          </>
        )}
      </button>
      {flipped && (
        <div className="row">
          <button type="button" className="btn btn-ok" onClick={() => mark('nho')}>
            Nhớ rồi
          </button>
          <button type="button" className="btn btn-bad" onClick={() => mark('chua')}>
            Chưa nhớ
          </button>
        </div>
      )}
    </div>
  )
}
