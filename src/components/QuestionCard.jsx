import { OPTION_KEYS } from '../lib/quiz.js'
import { topicById } from '../data/topics.js'

// reveal=true: tô xanh đáp án đúng, tô đỏ đáp án đã chọn nếu sai.
export default function QuestionCard({ q, number, selected, onSelect, reveal = false, showMeta = true }) {
  return (
    <div className="qcard">
      {showMeta && (
        <div className="qmeta">
          {number != null && <span className="badge">Câu {number}</span>}
          <span className="muted">{topicById[q.chuDe]?.ngan}</span>
        </div>
      )}
      <p className="qtext">{q.cauHoi}</p>
      <div className="options">
        {OPTION_KEYS.filter((k) => q.dapAn?.[k] != null && q.dapAn[k] !== '').map((k) => {
          let cls = 'option'
          if (selected === k) cls += ' selected'
          if (reveal && k === q.dapAnDung) cls += ' correct'
          if (reveal && selected === k && k !== q.dapAnDung) cls += ' wrong'
          return (
            <button
              key={k}
              type="button"
              className={cls}
              disabled={reveal || !onSelect}
              onClick={() => onSelect?.(k)}
              aria-pressed={selected === k}
            >
              <span className="okey">{k}</span>
              <span className="otext">{q.dapAn[k]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
