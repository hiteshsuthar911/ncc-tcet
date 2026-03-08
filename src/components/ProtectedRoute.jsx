import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}
