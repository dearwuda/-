import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AuthGuard() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner text="验证身份中..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
