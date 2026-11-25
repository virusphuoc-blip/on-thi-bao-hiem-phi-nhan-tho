import { Link } from 'react-router-dom'
import useTitle from '../lib/useTitle.js'

export default function NotFound() {
  useTitle('Không tìm thấy trang')
  return (
    <div>
      <h1 className="h1">Không tìm thấy trang</h1>
      <Link to="/" className="btn">
        Về trang chủ
      </Link>
    </div>
  )
}
