import {useState} from 'react'
import axios from 'axios'
import AuthWrapper from './AuthWrapper'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    password: '',
    confirmpassword: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Handle change in formData values
  function handleChange(e){
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value.trim()
    }));
  }

  async function handleSubmit(e){
    e.preventDefault();

    // Form Validation
    const pL = formData.password.length;
    if(pL < 6 || pL > 50){
      setError('Password must be between 6 and 50 characters long')
      return;
    }

    const validPassword = (/^[^\s]{6,50}$/).test(formData.password);
    
    if(!validPassword){
      setError('Password must not contain spaces');
      return;
    }

    if(formData.password !== formData.confirmpassword){
      setError('Password and Confirm password must be same');
      return;
    }

    setError('')

    if(token){
      setError('');
      try {
        setLoading(true);
        const response = await axios.patch( 
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/reset-password?token=${token}`,
          {
            "edited_field": "password",
            "password": formData.password
          },
          {
            withCredentials: true
          }
        );
        setLoading(false);

        if(response.data.success){
          console.log('Password reset successfully');
          navigate('/login');
        }
      } catch(err){
        setLoading(false);
        console.log(err.response.data.message);
      }
    }
    else{
      setError('Token is required');
    }
  }

  return (
    <AuthWrapper>
      <div className='form-container'>
        <h2 className='hero-text'>Reset Password</h2>
        <p className='hero-subtext'>No worries! Enter your details to reset it</p>
        <form name='reset-password-form' onSubmit={handleSubmit}>
          <div className='input-box'>
            <label>
              New Password
            </label>
            <input 
              name='password'
              type={isPasswordVisible ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder='Password' 
              autoComplete='on'
              required 
            />
            <FontAwesomeIcon 
              className='showhide-password' 
              icon={isPasswordVisible ? faEye : faEyeSlash} 
              onClick={()=>{setIsPasswordVisible(!isPasswordVisible)}}  
            />
          </div>
          <div className='input-box'>
            <label>
              Confirm Password
            </label>
            <input 
              name='confirmpassword'
              type={isConfirmPasswordVisible ? 'text' : 'password'} 
              value={formData.confirmpassword}
              onChange={handleChange}
              placeholder='Confirm Password' 
              autoComplete='on'
              required 
            />
            <FontAwesomeIcon 
              className='showhide-password' 
              icon={isConfirmPasswordVisible ? faEye : faEyeSlash} 
              onClick={()=>{setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}}  
            />
          </div>
          {
            error.length !== 0 &&
            <p className='alert-content -mt-4 mb-2'>
              {error}
            </p>
          }
          <button className={`btn-1 ${loading ? 'loading' : ''}`} type='submit' disabled={loading}>Reset Password</button>
        </form>  
      </div>
    </AuthWrapper>
  )
}

export default ResetPassword