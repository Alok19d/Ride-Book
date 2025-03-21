import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams, useNavigate }from 'react-router-dom'
import CaptainAuthWrapper from './CaptainAuthWrapper'
import { useDispatch } from 'react-redux'
import { setCaptainProfile, setCaptainError } from '../redux/features/captainSlice'

const CaptainValidateEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    function verifyCaptain(){
      if(token){
        setLoading(true);
        axios.get( 
          `${import.meta.env.VITE_BASE_URL}/api/v1/captain/verify-email?token=${token}`,
          {
            withCredentials: true
          }
        ).then((response) => {
          dispatch(setCaptainProfile(response.data.data.captain));
          navigate('/captain-home');
        }).catch(err => {
          setLoading(false);
          console.log(err.response.data.message);
        })
      }
    }
    verifyCaptain();
  },[]);
  
  return (
    <CaptainAuthWrapper>
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
              onClick={()=>{navigate('/captain-signup')}}          
            >
              Return to Register
            </button> 
          </div>
        }
      </div>
    </CaptainAuthWrapper>
  )
}

export default CaptainValidateEmail