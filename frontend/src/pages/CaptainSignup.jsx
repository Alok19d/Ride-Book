import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import CaptainAuthWrapper from './CaptainAuthWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

const VEHICLE_TYPES = ['auto', 'motorcycle', 'car'];
const VEHICLE_CAPACITIES = Array.from({length: 8}, (_, i) => i + 1);

const COMMON_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Brown', value: '#964B00' },
  { name: 'Green', value: '#008000' },
];

const CaptainSignup = () => {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    password: '',
    confirmpassword: '',
    vehicleColor: '',
    vehicleCapacity: '',
    vehicleType: '',
    vehicleModel: '',
    vehiclePlate: '',
    terms: false
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function validatePersonalDetails() {
    const validFullname = (/^[A-Za-z]{3,}( [A-Za-z]{2,})*$/).test(formData.fullname);
    const vaildEmail = (/^[\w.-]+@[\w.-]+\.\w{2,}$/).test(formData.email);

    if (!validFullname) {
      setError('Full Name must contain only letters and be at least 3 characters long');
      return false;
    }

    if (!vaildEmail) {
      setError('Please enter a valid email address');
      return false;
    }

    const pL = formData.password.length;
    if (pL < 6 || pL > 50) {
      setError('Password must be between 6 and 50 characters long')
      return false;
    }

    if (formData.password !== formData.confirmpassword) {
      setError('Password and Confirm password must be same');
      return false;
    }

    return true;
  }

  function handleNext() {
    if (validatePersonalDetails()) {
      setError('');
      setStep(2);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!formData.vehicleColor || !formData.vehicleCapacity || !formData.vehicleType || 
        !formData.vehicleModel || !formData.vehiclePlate) {
      setError('All vehicle information is required');
      return;
    }

    if (!VEHICLE_TYPES.includes(formData.vehicleType)) {
      setError('Please select a valid vehicle type: Auto, Car, or Motorcycle');
      return;
    }

    const capacity = Number(formData.vehicleCapacity);
    if (!VEHICLE_CAPACITIES.includes(capacity)) {
      setError('Please select a valid vehicle capacity between 1 and 8');
      return;
    }

    if (!formData.terms) {
      setError('You must agree to Terms & Conditions to proceed');
      return;
    }

    setError('');
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/captain/register`,
        {
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          vehicleColor: formData.vehicleColor,
          vehicleCapacity: parseInt(formData.vehicleCapacity),
          vehicleType: formData.vehicleType,
          vehicleModel: formData.vehicleModel,
          vehiclePlate: formData.vehiclePlate
        }
      );
      setLoading(false);
      if (response.data.success) {
        navigate('/check-email', { 
          state: { 
            type: 'verify',
            userType: 'captain'
          } 
        })
      }
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  return (
    <CaptainAuthWrapper>
      <div className='form-container'>
        <h2 className='hero-text'>Become a Captain!</h2>
        <p className='hero-subtext'>Create your captain account to start earning</p>
        
        <form name='signup-form' onSubmit={submitHandler}>
          {step === 1 ? (
            /*  Step 1: Captain Information */
            <>
              <div className='input-box'>
                <label>Full Name</label>
                <input 
                  name='fullname'
                  type='text' 
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder='Enter your full name' 
                  required 
                />
              </div>

              <div className='input-box'>
                <label>Email ID</label>
                <input 
                  name='email'
                  type='email' 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email address' 
                  required 
                />
              </div>

              <div className='input-box'>
                <label>Password</label>
                <input 
                  name='password'
                  type={isPasswordVisible ? 'text' : 'password'} 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password' 
                  required 
                />
                <FontAwesomeIcon 
                  className='showhide-password'
                  icon={isPasswordVisible ? faEye : faEyeSlash} 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}  
                />
              </div>

              <div className='input-box'>
                <label>Confirm Password</label>
                <input 
                  name='confirmpassword'
                  type={isConfirmPasswordVisible ? 'text' : 'password'} 
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  placeholder='Confirm Password' 
                  required 
                />
                <FontAwesomeIcon 
                  className='showhide-password'
                  icon={isConfirmPasswordVisible ? faEye : faEyeSlash} 
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}  
                />
              </div>

              {error && <p className='alert-content'>{error}</p>}
              
              <button 
                className={`btn-1`} type="button" onClick={handleNext}>
                Continue
              </button>
            </>
          ) : (
            /* Step 2: Vehicle Information */
            <>
              <div className='mb-6'>
                <label>Vehicle Color</label>
                <div className='w-full p-2 flex gap-3 items-center justify-between border rounded'>
                  {COMMON_COLORS.map(color => (
                    <div
                      key={color.name}
                      className={`w-6 h-6 rounded-full cursor-pointer
                        ${formData.vehicleColor === color.name ? 'outline-2' : ''}
                        ${color.name === 'White'?'border border-gray-300':''}
                      `}
                      style={{ 
                        backgroundColor: color.value,
                        
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, vehicleColor: color.name }))}
                    ></div>
                  ))}

                  <input 
                    type="color"
                    className={`w-6 h-6 cursor-pointer ${formData.vehicleColor.startsWith('#') ? 'outline-2' : ''}`}
                    onChange={(e) => {
                      const colorHex = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        vehicleColor: colorHex 
                      }));
                    }}
                    value={formData.vehicleColor.startsWith('#') ? formData.vehicleColor : '#404040'}
                    title="Choose custom color"
                  />
                    
                </div>
              </div>

              <div className='flex justify-between'>
                <div className='input-box basis-[48%]'>
                  <label>Vehicle Type</label>
                  <select
                    name='vehicleType'
                    className='select-fld capitalize'
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select vehicle type</option>
                    {VEHICLE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className='input-box basis-[48%]'>
                  <label>Vehicle Capacity</label>
                  <select
                    name='vehicleCapacity'
                    className='select-fld'
                    value={formData.vehicleCapacity}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select capacity</option>
                    {VEHICLE_CAPACITIES.map(capacity => (
                      <option key={capacity} value={capacity}>{capacity}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='input-box'>
                <label>Vehicle Model</label>
                <input 
                  name='vehicleModel'
                  type='text' 
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder='Enter vehicle model' 
                  required 
                />
              </div>

              <div className='input-box'>
                <label>Vehicle Plate Number</label>
                <input 
                  name='vehiclePlate'
                  type='text' 
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  placeholder='Enter vehicle plate number' 
                  required 
                />
              </div>

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

              {error && <p className='alert-content'>{error}</p>}

              <div className='flex gap-4'>
                <button className='btn-1' type='submit' disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Captain Account'}
                </button>
              </div>
            </>
          )}
        </form>

        <Link to='/captain-login' className='login-text'>Already have an account? Sign in</Link>
      </div>
    </CaptainAuthWrapper>
  )
}

export default CaptainSignup