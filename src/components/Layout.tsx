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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
              B
            </span>
            我的博客
          </Link>

          <nav className="flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  管理后台
                </Link>
                <span className="text-xs text-gray-300 hidden sm:inline">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  退出
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
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
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} 我的博客 &middot; Built with React + Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
