import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { questions } from '../data/index.js'
import { topicById } from '../data/topics.js'
import { topicStats } from '../lib/quiz.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import Practice from '../components/Practice.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import useTitle from '../lib/useTitle.js'

export default function TopicPractice() {
  const { id } = useParams()
  const topic = topicById[Number(id)]
  useTitle(topic ? topic.ngan : 'Chủ đề')
  const { state } = useProgress()
  const [done, setDone] = useState(false)
  const [round, setRound] = useState(0)
  const qids = useMemo(() => questions.filter((q) => q.chuDe === topic?.id).map((q) => q.id), [topic])
  // Bắt đầu từ câu đầu tiên chưa làm (tính lúc mở trang)
  const [start] = useState(() => Math.max(0, qids.findIndex((x) => !state.answers[x])))

  if (!topic) return <p>Không có chủ đề này.</p>
  const s = topicStats(questions, state.answers)[topic.id]

  return (
    <div>
      <h1 className="h2">{topic.ten}</h1>
      <div className="card">
        <p className="small">
          Đã làm {s.answeredQ}/{s.total} câu · đúng {s.percent}%
        </p>
        <ProgressBar value={s.answeredQ} max={s.total} label="Tiến độ chủ đề" />
      </div>
      {!qids.length && <p className="muted">Chủ đề này chưa có câu hỏi.</p>}
      {done ? (
        <div className="card">
          <p>Bạn đã làm hết các câu của chủ đề này.</p>
          <div className="row">
            <button type="button" className="btn" onClick={() => { setDone(false); setRound(round + 1) }}>
              Làm lại từ đầu
            </button>
            <Link to="/chu-de" className="btn btn-ghost">
              Chủ đề khác
            </Link>
          </div>
        </div>
      ) : (
        <Practice key={round} qids={qids} startIndex={round ? 0 : start} onDone={() => setDone(true)} />
      )}
    </div>
  )
}
