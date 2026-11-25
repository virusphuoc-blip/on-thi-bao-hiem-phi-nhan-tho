import { Link } from 'react-router-dom'
import { practiceQuestions as questions } from '../data/index.js'
import { TOPICS } from '../data/topics.js'
import { topicStats } from '../lib/quiz.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import useTitle from '../lib/useTitle.js'

export default function Topics() {
  useTitle('Ôn theo chủ đề')
  const { state } = useProgress()
  const stats = topicStats(questions, state.answers)
  return (
    <div>
      <h1 className="h1">Ôn theo chủ đề</h1>
      <div className="list">
        {TOPICS.map((t) => {
          const s = stats[t.id]
          return (
            <Link key={t.id} to={`/chu-de/${t.id}`} className="list-btn">
              <span>
                {t.id}. {t.ten}
              </span>
              <span className="muted small">
                Đã làm {s.answeredQ}/{s.total} câu{s.attempts ? ` · đúng ${s.percent}%` : ''}
              </span>
              <ProgressBar value={s.answeredQ} max={s.total} label={`Tiến độ ${t.ngan}`} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
