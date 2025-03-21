import AuthWrapper from './AuthWrapper'
import CaptainAuthWrapper from './CaptainAuthWrapper'
import { useLocation } from 'react-router-dom'

const CheckEmail = () => {
  const location = useLocation();
  const isPasswordReset = location.state?.type === 'reset';
  const isCaptain = location.state?.userType === 'captain';

  const title = isPasswordReset ? 'Reset Your Password' : 'Check Your Email';
  const message = isPasswordReset 
    ? "We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password."
    : "We've sent a verification link to your email. Please check your inbox and follow the instructions to continue.";

  const Wrapper = isCaptain ? CaptainAuthWrapper : AuthWrapper;

  return (
    <Wrapper>
      <div className='form-container'>
        <h2 className='hero-text'>{title}</h2>
        <p className='hero-subtext mt-1'>{message}</p>
        
        <div className='flex gap-4 mt-8'>
          <a 
            className='btn-2 flex items-center justify-center gap-2 basis-1/2'
            href='https://mail.google.com'
            target='blank'
          >
            <img className='h-4' src='./gmail.svg'/>
            <span>Open Gmail</span>
          </a>
          
          <a 
            className='btn-2 flex items-center justify-center gap-2 basis-1/2'
            href='https://outlook.live.com/mail'
            target='blank'
          >
            <img className='h-4' src='./outlook.svg'/>
            <span>Open Outlook</span>
          </a>
        </div>
      </div>
    </Wrapper>
  )
}

export default CheckEmail