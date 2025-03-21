import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams, useNavigate }from 'react-router-dom'
import AuthWrapper from './AuthWrapper'
import { useDispatch } from 'react-redux'
import { setUserProfile, setUserError } from '../redux/features/userSlice'

const ValidateOTP = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    function verifyUser(){
      if(token){
        setLoading(true);
        axios.get( 
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/verify-email?token=${token}`,
          {
            withCredentials: true
          }
        ).then((response) => {
          dispatch(setUserProfile(response.data.data.user));
          navigate('/');
        }).catch(err => {
          setLoading(false);
          console.log(err.response.data.message);
        })
      }
    }
    verifyUser();
  },[]);
  
  return (
    <AuthWrapper>
      <div className="form-container">
        {
          loading ?
          <div>
            <h2 className='loading-text'></h2>
          </div>
          :
          <div>
            <h2 className='hero-text'>
              Verification Failed
            </h2>
            <p className='mt-2 mb-5'>The email verification link you clicked is either expired or invalid. Please request a new verification link to complete your email verification.</p>
            <button 
              className='btn-1' 
              onClick={()=>{navigate('/signup')}}          
            >
              Return to Register
            </button> 
          </div>
        }
      </div>
    </AuthWrapper>
  )
}

export default ValidateOTP