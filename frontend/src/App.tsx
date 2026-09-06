import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import SummaryPage from './pages/SummaryPage'
import LoginPage from './pages/LoginPage'
import { isLoggedIn, removeToken } from './auth'

function NavBar() {
  const { pathname } = useLocation()
  const cls = (path: string) =>
    `px-6 py-3 text-sm font-medium hover:bg-green-800 transition-colors ${
      pathname === path ? 'bg-green-700 border-b-2 border-white' : ''
    }`
  return (
    <nav className="bg-green-900 text-white flex">
      <Link to="/" className={cls('/')}>カレンダー</Link>
      <Link to="/summary" className={cls('/summary')}>収支管理</Link>
    </nav>
  )
}

function AuthenticatedLayout() {
  const navigate = useNavigate()
  if (!isLoggedIn()) return <Navigate to="/login" replace />

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white p-4 flex items-center">
        <h1 className="text-2xl font-bold flex-1 text-center">競馬収支管理</h1>
        <button
          onClick={handleLogout}
          className="text-xs text-green-200 hover:text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
        >
          ログアウト
        </button>
      </header>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
