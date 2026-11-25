import { Link } from 'react-router-dom'
import { useProgress } from '../lib/ProgressContext.jsx'
import useTitle from '../lib/useTitle.js'

export default function ExamHistory() {
  useTitle('Lịch sử thi')
  const { state } = useProgress()
  return (
    <div>
      <h1 className="h1">Lịch sử thi</h1>
      {!state.history.length && <p className="muted">Chưa có lần thi nào.</p>}
      <div className="list">
        {state.history.map((h) => (
          <Link key={h.id} to={`/thi-thu/ket-qua/${h.id}`} className={`list-btn ${h.pass ? 'ok' : 'bad'}`}>
            <span>
              {h.title} — {h.correct}/{h.total} ({h.percent}%) · {h.pass ? 'Đạt' : 'Chưa đạt'}
            </span>
            <span className="muted small">{new Date(h.at).toLocaleString('vi-VN')}</span>
          </Link>
        ))}
      </div>
      <Link to="/thi-thu" className="btn block">
        Thi thử
      </Link>
    </div>
  )
}
