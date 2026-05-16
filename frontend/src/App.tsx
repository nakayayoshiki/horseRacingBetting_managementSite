import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import SummaryPage from './pages/SummaryPage'

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-800 text-white p-4">
          <h1 className="text-2xl font-bold text-center">競馬収支管理</h1>
        </header>
        <NavBar />
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
