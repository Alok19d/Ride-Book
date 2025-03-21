import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CaptainAuthWrapper from './CaptainAuthWrapper'

const CaptainForgotPassword = () => {
  const navigate = useNavigate();
  const [captain,setCaptain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  async function handleSubmit(e){
    e.preventDefault();

    // Form Validation
    const vaildEmail = (/^[\w.-]+@[\w.-]+\.\w{2,}$/).test(captain);
    const validPhone = (/^[1-9]\d{9}$/).test(captain);

    if(!(vaildEmail || validPhone)){
      setError('Please enter a valid email address or a valid 10 digit phone number');
      return;
    }
    
    setError('');

    try{
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/captain/forgot-password`,
        {
          email: vaildEmail ? captain : undefined,
          phone: validPhone ? captain : undefined,
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
            userType: 'captain'
          } 
        })
      }
    }catch(err){
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  return (
    <CaptainAuthWrapper>
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
              value={captain}
              onChange={(e)=>{setCaptain(e.target.value)}}
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
    </CaptainAuthWrapper>
  )
}

export default CaptainForgotPassword