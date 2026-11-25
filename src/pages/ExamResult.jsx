import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { questionById } from '../data/index.js'
import { passThreshold } from '../lib/quiz.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import { PASS_PERCENT } from '../config.js'
import QuestionCard from '../components/QuestionCard.jsx'
import Explain from '../components/Explain.jsx'
import useTitle from '../lib/useTitle.js'

export default function ExamResult() {
  useTitle('Kết quả thi')
  const { id } = useParams()
  const { state } = useProgress()
  const [filter, setFilter] = useState('all')
  const entry = state.history.find((h) => h.id === id)

  if (!entry) {
    return (
      <div>
        <p>Không tìm thấy bài thi.</p>
        <Link to="/thi-thu" className="btn">
          Về Thi thử
        </Link>
      </div>
    )
  }

  const items = entry.qids
    .map((qid, i) => ({ q: questionById[qid], i, pick: entry.picks[qid] }))
    .filter((x) => x.q)
    .filter((x) => filter === 'all' || x.pick !== x.q.dapAnDung)

  return (
    <div>
      <h1 className="h1">Kết quả: {entry.title}</h1>
      <div className={`card result ${entry.pass ? 'ok' : 'bad'}`}>
        <p className="score">
          {entry.correct}/{entry.total} câu đúng — {entry.percent}%
        </p>
        <p className="verdict">{entry.pass ? 'ĐẠT' : 'CHƯA ĐẠT'}</p>
        <p className="muted small">
          Ngưỡng đạt: {passThreshold(entry.total, PASS_PERCENT)}/{entry.total} ({PASS_PERCENT}%) ·{' '}
          {new Date(entry.at).toLocaleString('vi-VN')}
        </p>
      </div>
      <div className="row">
        <button type="button" className={`btn ${filter === 'all' ? '' : 'btn-ghost'}`} onClick={() => setFilter('all')}>
          Xem lại tất cả
        </button>
        <button type="button" className={`btn ${filter === 'wrong' ? '' : 'btn-ghost'}`} onClick={() => setFilter('wrong')}>
          Chỉ câu sai ({entry.total - entry.correct})
        </button>
      </div>
      <div className="review">
        {items.map(({ q, i, pick }) => (
          <div key={q.id} className={`review-item ${pick === q.dapAnDung ? 'ok' : 'bad'}`}>
            <QuestionCard q={q} number={i + 1} selected={pick} reveal />
            <p className="small">Bạn chọn: {pick || 'Chưa trả lời'}</p>
            <Explain q={q} selected={pick || null} />
          </div>
        ))}
      </div>
      <div className="row">
        <Link to="/thi-thu" className="btn">
          Thi đề khác
        </Link>
        <Link to="/thi-thu/lich-su" className="btn btn-ghost">
          Lịch sử thi
        </Link>
      </div>
    </div>
  )
}
