import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../lib/ProgressContext.jsx'
import { questionById } from '../data/index.js'
import { WRONG_REMOVE_STREAK } from '../config.js'
import Practice from '../components/Practice.jsx'
import useTitle from '../lib/useTitle.js'

export default function WrongPractice() {
  useTitle('Câu hay sai')
  const { state } = useProgress()
  const [session, setSession] = useState(null)
  const wrongIds = Object.keys(state.wrong).filter((id) => questionById[id])
  const hardIds = state.hard.filter((id) => questionById[id])

  if (session) {
    return (
      <div>
        <h1 className="h2">{session.title}</h1>
        <p className="muted small">Còn {wrongIds.length} câu trong danh sách Câu hay sai.</p>
        <Practice key={session.key} qids={session.qids} onDone={() => setSession(null)} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="h1">Câu hay sai</h1>
      <div className="card">
        <p className="stat-num">{wrongIds.length}</p>
        <p>câu đang trong danh sách (đã sai ít nhất 1 lần ở Thi thử hoặc Ôn chủ đề).</p>
        <p className="muted small">Làm đúng {WRONG_REMOVE_STREAK} lần liên tiếp thì câu tự ra khỏi danh sách.</p>
        <button
          type="button"
          className="btn block"
          disabled={!wrongIds.length}
          onClick={() => setSession({ key: Date.now(), title: 'Làm lại câu hay sai', qids: wrongIds })}
        >
          Làm lại {wrongIds.length} câu
        </button>
      </div>
      <div className="card">
        <p>
          <strong>{hardIds.length}</strong> câu đã đánh dấu “Câu khó”.
        </p>
        <button
          type="button"
          className="btn btn-ghost block"
          disabled={!hardIds.length}
          onClick={() => setSession({ key: Date.now(), title: 'Ôn câu khó', qids: hardIds })}
        >
          Ôn câu khó
        </button>
      </div>
      {!wrongIds.length && (
        <p className="muted">
          Chưa có câu sai nào. <Link to="/thi-thu">Thi thử</Link> hoặc <Link to="/chu-de">ôn theo chủ đề</Link> để bắt đầu.
        </p>
      )}
    </div>
  )
}
