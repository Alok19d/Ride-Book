import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
  const { profile } = useSelector(state => state.captain);

  return profile ? <Outlet /> : <Navigate to='/captain-login' />
}

export default ProtectedRoute