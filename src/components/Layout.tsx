import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../lib/supabase'

export default function Layout() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            我的博客
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              首页
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  管理
                </Link>
                <span className="text-gray-400 text-sm">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm cursor-pointer"
                >
                  退出
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                登录
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} 我的博客 &middot; Powered by React + Supabase
        </div>
      </footer>
    </div>
  )
}
