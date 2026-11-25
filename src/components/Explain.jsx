export default function Explain({ q, selected }) {
  const ok = selected ? selected === q.dapAnDung : null
  return (
    <div className={`explain ${ok === true ? 'ok' : ok === false ? 'bad' : ''}`}>
      {ok !== null && <p className="verdict">{ok ? 'Đúng!' : 'Sai'}</p>}
      <p>
        Đáp án đúng: <strong>{q.dapAnDung}. {q.dapAn?.[q.dapAnDung]}</strong>
      </p>
      {q.giaiThich && <p>Giải thích: {q.giaiThich}</p>}
      {q.nguon && <p className="muted small">Nguồn: {q.nguon}</p>}
    </div>
  )
}
