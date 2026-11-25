import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { questions, questionById } from '../data/index.js'
import { searchQuestions } from '../lib/quiz.js'
import QuestionCard from '../components/QuestionCard.jsx'
import Explain from '../components/Explain.jsx'
import useTitle from '../lib/useTitle.js'

function Result({ q, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen)
  return (
    <div className="search-item">
      <button type="button" className="list-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q.cauHoi}</span>
        <span className="muted small">{q.nguon || q.de}</span>
      </button>
      {open && (
        <div>
          <QuestionCard q={q} reveal showMeta={false} />
          <Explain q={q} selected={null} />
        </div>
      )}
    </div>
  )
}

export default function Search() {
  useTitle('Tìm kiếm câu hỏi')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const focusId = params.get('id')
  const focused = focusId ? questionById[focusId] : null
  const results = focused ? [focused] : searchQuestions(questions, query, 50)

  return (
    <div>
      <h1 className="h1">Tìm kiếm câu hỏi</h1>
      <input
        className="search-input"
        type="search"
        placeholder="Nhập từ khóa, ví dụ: thời gian chờ"
        value={query}
        onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
        aria-label="Từ khóa"
      />
      {query && !focused && <p className="muted small">{results.length >= 50 ? 'Hiện 50 kết quả đầu' : `${results.length} kết quả`}</p>}
      <div className="list">
        {results.map((q) => (
          <Result key={q.id} q={q} initiallyOpen={!!focused} />
        ))}
      </div>
    </div>
  )
}
