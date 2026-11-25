import { Link } from 'react-router-dom'
import { practiceQuestions, questions } from '../data/index.js'
import { examList, overallStats, topicStats, weakestTopic } from '../lib/quiz.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import { EXAM_QUESTION_COUNT, WEAK_TOPIC_MIN_ANSWERED } from '../config.js'
import useTitle from '../lib/useTitle.js'

const QUICK = [
  { to: '/thi-thu', label: 'Thi thử', desc: 'Mô phỏng đề thi thật, có giờ' },
  { to: '/chu-de', label: 'Ôn theo chủ đề', desc: 'Làm từng câu, xem đáp án ngay' },
  { to: '/flashcard', label: 'Flashcard', desc: 'Lật thẻ học thuộc đáp án' },
  { to: '/cau-hay-sai', label: 'Câu hay sai', desc: 'Làm lại các câu đã sai' },
  { to: '/meo-nho', label: 'Bảng mẹo nhớ', desc: 'Con số, quy tắc hay ra thi' },
  { to: '/tim-kiem', label: 'Tìm kiếm', desc: 'Tra câu hỏi theo từ khóa' },
  { to: '/thong-ke', label: 'Thống kê', desc: '% đúng theo chủ đề' },
]

export default function Home() {
  useTitle('')
  const { state } = useProgress()
  const overall = overallStats(state.answers)
  const weak = weakestTopic(topicStats(practiceQuestions, state.answers), overall.answeredQ, WEAK_TOPIC_MIN_ANSWERED)
  const wrongCount = Object.keys(state.wrong).length

  return (
    <div>
      <h1 className="h1">Ôn thi chứng chỉ đại lý bảo hiểm phi nhân thọ</h1>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-num">{questions.length}</span>
          <span className="stat-label">câu hỏi</span>
        </div>
        <div className="stat">
          <span className="stat-num">{examList(practiceQuestions, EXAM_QUESTION_COUNT).length}</span>
          <span className="stat-label">đề thi</span>
        </div>
        <div className="stat">
          <span className="stat-num">{overall.answeredQ}</span>
          <span className="stat-label">câu đã làm</span>
        </div>
        <div className="stat">
          <span className="stat-num">{overall.attempts ? `${overall.percent}%` : '—'}</span>
          <span className="stat-label">đúng chung</span>
        </div>
      </div>

      {weak && (
        <Link to={`/chu-de/${weak.topic.id}`} className="card weak">
          <strong>Chủ đề yếu nhất:</strong> {weak.topic.ten} — đúng {weak.stats.percent}%. Bấm để ôn lại.
        </Link>
      )}

      <div className="quick">
        {QUICK.map((x) => (
          <Link key={x.to} to={x.to} className="quick-btn">
            <span className="quick-label">
              {x.label}
              {x.to === '/cau-hay-sai' && wrongCount > 0 && <span className="pill">{wrongCount}</span>}
            </span>
            <span className="quick-desc">{x.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
