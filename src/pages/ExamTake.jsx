import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { questionById } from '../data/index.js'
import { gradeExam } from '../lib/quiz.js'
import { loadExam, saveExam } from '../lib/progress.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import { PASS_PERCENT } from '../config.js'
import QuestionCard from '../components/QuestionCard.jsx'
import useTitle from '../lib/useTitle.js'

function fmt(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function ExamTake() {
  useTitle('Đang thi')
  const navigate = useNavigate()
  const { answerMany, addHistory } = useProgress()
  const [exam, setExam] = useState(() => loadExam())
  const [now, setNow] = useState(() => Date.now())
  const [confirming, setConfirming] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  const update = (patch) =>
    setExam((e) => {
      const next = { ...e, ...patch }
      saveExam(next)
      return next
    })

  const submit = useCallback(() => {
    const e = loadExam()
    if (!e) return
    const g = gradeExam(questionById, e.qids, e.picks, PASS_PERCENT)
    const id = String(Date.now())
    answerMany(e.qids.filter((q) => e.picks[q]).map((q) => [q, e.picks[q] === questionById[q]?.dapAnDung]))
    addHistory({
      id,
      at: Date.now(),
      title: e.title,
      total: g.total,
      correct: g.correct,
      percent: g.percent,
      pass: g.pass,
      durationMs: Math.min(Date.now(), e.endAt) - e.startAt,
      qids: e.qids,
      picks: e.picks,
    })
    saveExam(null)
    navigate(`/thi-thu/ket-qua/${id}`, { replace: true })
  }, [answerMany, addHistory, navigate])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = exam ? exam.endAt - now : 0
  useEffect(() => {
    if (exam && remaining <= 0) submit()
  }, [exam, remaining, submit])

  if (!exam) return <Navigate to="/thi-thu" replace />
  const qid = exam.qids[exam.idx]
  const q = questionById[qid]
  const answered = exam.qids.filter((x) => exam.picks[x]).length
  const unanswered = exam.qids.length - answered

  return (
    <div>
      <div className="exam-bar">
        <span className={`timer ${remaining < 5 * 60000 ? 'low' : ''}`} aria-label="Thời gian còn lại">
          ⏱ {fmt(remaining)}
        </span>
        <span>
          Đã làm {answered}/{exam.qids.length}
        </span>
        <button type="button" className="btn btn-small" onClick={() => setConfirming(true)}>
          Nộp bài
        </button>
      </div>
      <h1 className="h2">{exam.title}</h1>

      {confirming && (
        <div className="card confirm">
          <p>
            {unanswered > 0 ? `Còn ${unanswered} câu chưa trả lời. ` : ''}Bạn chắc chắn muốn nộp bài?
          </p>
          <div className="row">
            <button type="button" className="btn" onClick={submit}>
              Nộp bài
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
              Làm tiếp
            </button>
          </div>
        </div>
      )}

      {q && (
        <QuestionCard
          q={q}
          number={exam.idx + 1}
          selected={exam.picks[qid]}
          onSelect={(k) => update({ picks: { ...exam.picks, [qid]: k } })}
        />
      )}

      <div className="row nav-row">
        <button type="button" className="btn btn-ghost" disabled={exam.idx === 0} onClick={() => update({ idx: exam.idx - 1 })}>
          ← Câu trước
        </button>
        {exam.idx < exam.qids.length - 1 ? (
          <button type="button" className="btn" onClick={() => update({ idx: exam.idx + 1 })}>
            Câu sau →
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setConfirming(true)}>
            Nộp bài
          </button>
        )}
      </div>

      <button type="button" className="btn btn-ghost block" onClick={() => setShowGrid(!showGrid)}>
        {showGrid ? 'Ẩn danh sách câu' : 'Xem danh sách câu'}
      </button>
      {showGrid && (
        <div className="qgrid">
          {exam.qids.map((x, i) => (
            <button
              key={x}
              type="button"
              className={`qgrid-btn ${exam.picks[x] ? 'done' : ''} ${i === exam.idx ? 'current' : ''}`}
              onClick={() => update({ idx: i })}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
