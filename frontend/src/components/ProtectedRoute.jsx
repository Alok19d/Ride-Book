import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
  const { profile } = useSelector(state => state.user);

  return profile ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute