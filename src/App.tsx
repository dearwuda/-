import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/public/HomePage'
import PostPage from './pages/public/PostPage'
import LoginPage from './pages/admin/LoginPage'
import AuthGuard from './pages/admin/AuthGuard'
import DashboardPage from './pages/admin/DashboardPage'
import EditorPage from './pages/admin/EditorPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/editor/new" element={<EditorPage />} />
            <Route path="/admin/editor/:id" element={<EditorPage />} />
          </Route>

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <span className="text-6xl block mb-4">🧭</span>
                <h1 className="text-2xl font-bold mb-2">页面不存在</h1>
                <p className="text-gray-500">你访问的页面不存在或已失效</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  )
}
