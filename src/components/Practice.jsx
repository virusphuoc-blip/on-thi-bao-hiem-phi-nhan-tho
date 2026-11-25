import { useState } from 'react'
import { questionById } from '../data/index.js'
import { useProgress } from '../lib/ProgressContext.jsx'
import QuestionCard from './QuestionCard.jsx'
import Explain from './Explain.jsx'

// Làm lần lượt từng câu, chọn xong hiện ngay Đúng/Sai + đáp án + giải thích.
export default function Practice({ qids, startIndex = 0, header, onDone }) {
  const { state, answer, toggleHard } = useProgress()
  const [idx, setIdx] = useState(Math.min(startIndex, Math.max(0, qids.length - 1)))
  const [picks, setPicks] = useState({})

  if (!qids.length) return null
  const q = questionById[qids[idx]]
  if (!q) return null
  const picked = picks[q.id]
  const hard = state.hard.includes(q.id)
  const last = idx === qids.length - 1

  function pick(k) {
    if (picked) return
    setPicks((p) => ({ ...p, [q.id]: k }))
    answer(q.id, k === q.dapAnDung)
  }

  return (
    <div>
      {header?.({ idx, picks })}
      <QuestionCard q={q} number={idx + 1} selected={picked} onSelect={pick} reveal={!!picked} />
      {picked && <Explain q={q} selected={picked} />}
      <div className="row">
        <button type="button" className={`btn ${hard ? 'btn-warn' : 'btn-ghost'}`} onClick={() => toggleHard(q.id)}>
          {hard ? '★ Câu khó' : '☆ Câu khó'}
        </button>
      </div>
      <div className="row nav-row">
        <button type="button" className="btn btn-ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          ← Câu trước
        </button>
        {last ? (
          <button type="button" className="btn" onClick={() => onDone?.(picks)}>
            Hoàn thành
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setIdx(idx + 1)}>
            Câu sau →
          </button>
        )}
      </div>
    </div>
  )
}
