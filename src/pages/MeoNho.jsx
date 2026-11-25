import { Link } from 'react-router-dom'
import { meoNho, questionById } from '../data/index.js'
import useTitle from '../lib/useTitle.js'

function srcLabel(id) {
  const q = questionById[id]
  return q ? `${q.de} câu ${Number(id.split('-c')[1])}` : id
}

export default function MeoNho() {
  useTitle('Bảng mẹo nhớ')
  return (
    <div>
      <h1 className="h1">Bảng mẹo nhớ</h1>
      <p className="muted">Các con số, quy tắc hay ra thi — tổng hợp từ đáp án trong ngân hàng câu hỏi. Bấm nguồn để xem câu gốc.</p>
      {!meoNho.length && <p className="card">Chưa có dữ liệu — bảng sẽ được tổng hợp sau khi nạp tài liệu nguồn.</p>}
      {meoNho.map((g) => (
        <section key={g.nhom} className="tips">
          <h2 className="h2">{g.nhom}</h2>
          <table className="tips-table">
            <thead>
              <tr>
                <th>{g.cot1 || 'Nội dung'}</th>
                <th>{g.cot2 || 'Ghi nhớ'}</th>
              </tr>
            </thead>
            <tbody>
              {g.items.map((it, i) => (
                <tr key={i}>
                  <td>{it.chuDe}</td>
                  <td>
                    <strong>{it.ghiNho}</strong>
                    {!!it.nguon?.length && (
                      <span className="tip-src">
                        Nguồn:{' '}
                        {it.nguon.map((id, j) => (
                          <span key={id}>
                            {j > 0 && ', '}
                            <Link to={`/tim-kiem?id=${encodeURIComponent(id)}`}>{srcLabel(id)}</Link>
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
