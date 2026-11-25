import { practiceQuestions as questions } from '../data/index.js'
import { TOPICS } from '../data/topics.js'
import { overallStats, topicStats } from '../lib/quiz.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import useTitle from '../lib/useTitle.js'

export default function Stats() {
  useTitle('Thống kê')
  const { state, reset } = useProgress()
  const overall = overallStats(state.answers)
  const stats = topicStats(questions, state.answers)
  const best = state.history.reduce((m, h) => (!m || h.percent > m.percent ? h : m), null)

  return (
    <div>
      <h1 className="h1">Thống kê</h1>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-num">{overall.answeredQ}</span>
          <span className="stat-label">câu đã làm</span>
        </div>
        <div className="stat">
          <span className="stat-num">{overall.attempts ? `${overall.percent}%` : '—'}</span>
          <span className="stat-label">đúng chung</span>
        </div>
        <div className="stat">
          <span className="stat-num">{state.history.length}</span>
          <span className="stat-label">lần thi thử</span>
        </div>
        <div className="stat">
          <span className="stat-num">{best ? `${best.correct}/${best.total}` : '—'}</span>
          <span className="stat-label">điểm cao nhất</span>
        </div>
      </div>
      <h2 className="h2">% đúng theo chủ đề</h2>
      <div className="bars">
        {TOPICS.map((t) => {
          const s = stats[t.id]
          return (
            <div key={t.id} className="bar-row">
              <div className="bar-label">
                <span>
                  {t.id}. {t.ngan}
                </span>
                <span className="muted small">{s.attempts ? `${s.percent}% (${s.correct}/${s.attempts} lượt)` : 'chưa làm'}</span>
              </div>
              <div className="bar">
                <div className={`bar-fill ${s.percent < 50 ? 'low' : s.percent < 70 ? 'mid' : ''}`} style={{ width: `${s.attempts ? s.percent : 0}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <button
        type="button"
        className="btn btn-ghost block danger"
        onClick={() => {
          if (window.confirm('Xóa toàn bộ tiến độ học và lịch sử thi trên trình duyệt này?')) reset()
        }}
      >
        Xóa tiến độ học
      </button>
    </div>
  )
}
