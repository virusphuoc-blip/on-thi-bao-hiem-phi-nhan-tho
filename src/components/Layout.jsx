import { Link, NavLink, Outlet } from 'react-router-dom'
import { APP_NAME, APP_VERSION } from '../config.js'

const NAV = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/thi-thu', label: 'Thi thử' },
  { to: '/chu-de', label: 'Chủ đề' },
  { to: '/flashcard', label: 'Flashcard' },
  { to: '/meo-nho', label: 'Mẹo nhớ' },
]

export default function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          {APP_NAME}
        </Link>
        <Link to="/tim-kiem" className="topbar-search" aria-label="Tìm kiếm câu hỏi">
          Tìm
        </Link>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2026 VH Phước. Mọi nội dung thuộc về VH Phước.</p>
        <p className="muted">Phiên bản {APP_VERSION}</p>
      </footer>
      <nav className="bottomnav" aria-label="Điều hướng chính">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
