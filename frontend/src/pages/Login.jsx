import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AuthWrapper from './AuthWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../redux/features/userSlice'

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData,setFormData] = useState({
    user: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle change in formData values
  function handleChange(e){
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value.trim()
    }));
  }

  async function submitHandler(e){
    e.preventDefault();

    // Form Validation
    const vaildEmail = (/^[\w.-]+@[\w.-]+\.\w{3,}$/).test(formData.user);
    const validPhone = (/^[1-9]\d{9}$/).test(formData.user);

    
    if(!(vaildEmail || validPhone)){
      setError('Please enter a valid email address or a valid 10 digit phone number');
      return;
    }

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
    
    setError('');

    try{
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/login`,
        {
          email: vaildEmail ? formData.user : undefined,
          phone: validPhone ? formData.user : undefined,
          password: formData.password,
        },
        { withCredentials: true }  
      );
      setLoading(false);
      if(response.data.success){
        dispatch(setUserProfile(response.data.data.user));
        navigate('/');
      }
    }catch(err){
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  return (
    <AuthWrapper>
      <div className='form-container'>
        <h2 className='hero-text'>Welcome Back!</h2>
        <p className='hero-subtext'>Please sign in to continue</p>
        <form name='login-form' onSubmit={submitHandler}>
          <div className='input-box'>
            <label>
              Email or Phone Number
            </label>
            <input 
              name="user"
              type='text' 
              value={formData.user} 
              onChange={handleChange}
              placeholder='Enter your email or phone' 
              autoComplete='on'
              required 
            />
          </div>

          <div className='input-box'>
            <label>Password</label>
            <input 
              name="password"
              type={isPasswordVisible ? 'text' : 'password'} 
              value={formData.password} 
              onChange={handleChange}                  
              placeholder='Enter your password' 
              autoComplete='on'
              required
            />
            <FontAwesomeIcon 
              className='showhide-password' 
              icon={isPasswordVisible ? faEye : faEyeSlash} 
              onClick={()=>{setIsPasswordVisible(!isPasswordVisible)}}  
            />
          </div>
          
          {
            error.length !== 0 &&
            <p className='alert-content -mt-4 mb-2'>
              {error}
            </p>
          }

          <Link className='block mb-2 text-right' to='/forgot-password'>Forgot Password?</Link>
          
          <button className={`btn-1 ${loading ? 'loading' : ''}`} type='submit' disabled={loading}>Sign In</button>
        </form>
        <Link to='/signup' className='signup-text'>Don't have an account? Sign up</Link>
      </div>
    </AuthWrapper>
  )
}

export default Login