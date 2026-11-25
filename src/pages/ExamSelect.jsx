import { Link, useNavigate } from 'react-router-dom'
import { questions } from '../data/index.js'
import { buildExam, examList } from '../lib/quiz.js'
import { loadExam, saveExam } from '../lib/progress.js'
import { EXAM_DURATION_MINUTES, EXAM_QUESTION_COUNT, PASS_PERCENT } from '../config.js'
import useTitle from '../lib/useTitle.js'

export default function ExamSelect() {
  useTitle('Thi thử')
  const navigate = useNavigate()
  const current = loadExam()
  const exams = examList(questions)

  function start(de) {
    const { title, qids } = buildExam(questions, de, EXAM_QUESTION_COUNT)
    const now = Date.now()
    saveExam({ title, qids, picks: {}, startAt: now, endAt: now + EXAM_DURATION_MINUTES * 60000, idx: 0 })
    navigate('/thi-thu/lam')
  }

  return (
    <div>
      <h1 className="h1">Thi thử</h1>
      <p className="muted">
        Mỗi đề {EXAM_QUESTION_COUNT} câu, {EXAM_DURATION_MINUTES} phút. Đạt khi đúng từ {PASS_PERCENT}% trở lên.
      </p>
      {current && (
        <Link to="/thi-thu/lam" className="card weak">
          Đang làm dở: <strong>{current.title}</strong>. Bấm để tiếp tục.
        </Link>
      )}
      <div className="list">
        <button type="button" className="list-btn primary" onClick={() => start(null)}>
          <span>Đề ngẫu nhiên</span>
          <span className="muted small">Trộn {EXAM_QUESTION_COUNT} câu từ toàn bộ ngân hàng</span>
        </button>
        {exams.map((e) => (
          <button key={e.de} type="button" className="list-btn" onClick={() => start(e.de)}>
            <span>{e.de}</span>
            <span className="muted small">{Math.min(e.count, EXAM_QUESTION_COUNT)} câu</span>
          </button>
        ))}
      </div>
      <Link to="/thi-thu/lich-su" className="btn btn-ghost block">
        Lịch sử thi
      </Link>
    </div>
  )
}
