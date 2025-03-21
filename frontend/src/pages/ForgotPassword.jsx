import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AuthWrapper from './AuthWrapper'

const ForgotPassword = () => {

  const navigate = useNavigate();
  const [user,setUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  async function handleSubmit(e){
    e.preventDefault();

    // Form Validation
    const vaildEmail = (/^[\w.-]+@[\w.-]+\.\w{2,}$/).test(user);
    const validPhone = (/^[1-9]\d{9}$/).test(user);

    if(!(vaildEmail || validPhone)){
      setError('Please enter a valid email address or a valid 10 digit phone number');
      return;
    }
    
    setError('');

    try{
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/forgot-password`,
        {
          email: vaildEmail ? user : undefined,
          phone: validPhone ? user : undefined,
        },
        {
          withCredentials: true
        }
      );
      setLoading(false);
      if(response.data.success){
        navigate('/check-email', { 
          state: { 
            type: 'reset',
            userType: 'user'
          } 
        })
      }
    }catch(err){
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  return (
    <AuthWrapper>
      <div className='form-container'>
        <h2 className='hero-text'>Forgot Your Password?</h2>
        <p className='hero-subtext'>No worries! Enter your details to reset it</p>
        <form name='reset-password-form' onSubmit={(e)=>{handleSubmit(e)}}>
          <div className='input-box'>
            <label>
              Email or Phone Number
            </label>
            <input 
              type='text' 
              value={user}
              onChange={(e)=>{setUser(e.target.value)}}
              placeholder='Enter your email or phone' 
              autoComplete='on'
              required 
            />
          </div>
          {
            error.length !== 0 &&
            <p className='alert-content -mt-4 mb-2'>
              {error}
            </p>
          }
          <p className='info-text'>A reset password link will be sent to your registered email address.</p>
          <button className={`btn-1 ${loading ? 'loading' : ''}`} type='submit' disabled={loading}>Continue</button>
        </form>  
      </div>
    </AuthWrapper>
  )
}

export default ForgotPassword