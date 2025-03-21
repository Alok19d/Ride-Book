import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AuthWrapper from './AuthWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

const Signup = () => {

  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    email:'',
    fullname: '',
    password: '',
    confirmpassword: '',
    terms: false
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle change in formData values
  function handleChange(e){
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // Form Validation
  async function submitHandler(e){
    e.preventDefault();

    const validFullname = (/^[A-Za-z]{3,}( [A-Za-z]{2,})*$/).test(formData.fullname);
    const vaildEmail = (/^[\w.-]+@[\w.-]+\.\w{2,}$/).test(formData.email);

    if(!validFullname){
      setError('Full Name must contain only letters and be at least 3 characters long');
      return;
    }

    if(!vaildEmail){
      setError('Please enter a valid email address');
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

    if(formData.password !== formData.confirmpassword){
      setError('Password and Confirm password must be same');
      return;
    }

    if(!formData.terms){
      setError('You must agree to Terms & Conditions to proceed');
      return;
    }

    setError('');
    
    try{
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/register`,
        {
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,      
        }
      );
      setLoading(false);
      if(response.data.success){
        navigate('/check-email', { 
          state: { 
            type: 'verify',
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
        <h2 className='hero-text'>Join Us Today!</h2>
        <p className='hero-subtext'>Create an account to get started</p>
        <form name='signup-form' onSubmit={submitHandler}>
          <div className='input-box'>
            <label>
              Full Name
            </label>
            <input 
              name='fullname'
              type='text' 
              value={formData.fullname}
              onChange={handleChange}
              placeholder='Enter your full name' 
              autoComplete='on'
              required 
            />
          </div>
          <div className='input-box'>
            <label>
              Email ID
            </label>
            <input 
              name='email'
              type='email' 
              value={formData.user}
              placeholder='Enter your email address' 
              onChange={handleChange}
              autoComplete='on'
              required 
            />
          </div>
          <div className='input-box'>
            <label>
              Password
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

          <div>
            <input 
              name='terms'
              className='terms-checkbox' 
              type='checkbox'
              value={formData.terms}
              onChange={handleChange}
              required
            />
            <span className='agree-terms'> I agree to the <a>Terms & Conditions</a> and <a>Privacy Policy</a>.</span>
          </div>
          <button className={`btn-1 ${loading ? 'loading' : ''}`} type='submit' disabled={loading}>Create Account</button>
        </form>
        <Link to='/login' className='login-text'>Already have an account? Sign in</Link>
      </div>
    </AuthWrapper>
  )
}

export default Signup