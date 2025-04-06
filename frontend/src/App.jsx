import './App.css'
import {Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CheckEmail from './pages/CheckEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ValidateEmail from './pages/ValidateEmail'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Ride from './pages/Ride'
import Profile from './pages/Profile'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import CaptainForgotPassword from './pages/CaptainForgotPassword'
import CaptainResetPassword from './pages/CaptainResetPassword'
import CaptainValidateEmail from './pages/CaptainValidateEmail'
import CaptainProtectedRoute from './components/CaptainProtectedRoute'
import CaptainHome from './pages/CaptainHome'
import CaptainProfile from './pages/CaptainProfile'
import CaptainRide from './pages/CaptainRide'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/check-email' element={<CheckEmail />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/reset-password' element={<ResetPassword />}/>
      <Route path='/validate-email' element={<ValidateEmail />}/>
      
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Home />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/ride' element={<Ride />}/>
      </Route>

      <Route path='/captain-login' element={<CaptainLogin />}/>
      <Route path='/captain-signup' element={<CaptainSignup />}/>
      <Route path='/captain-forgot-password' element={<CaptainForgotPassword />}/>
      <Route path='/captain-reset-password' element={<CaptainResetPassword />}/>
      <Route path='/captain-validate-email' element={<CaptainValidateEmail />}/>
      
      <Route element={<CaptainProtectedRoute />}>
        <Route path='/captain-home' element={<CaptainHome />} />
        <Route path='/captain-profile' element={<CaptainProfile />} />
        <Route path='/captain-ride' element={<CaptainRide />} />
      </Route>
    </Routes>
  )
}

export default App