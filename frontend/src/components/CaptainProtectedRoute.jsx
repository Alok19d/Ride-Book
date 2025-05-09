import axios from 'axios'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { setCaptainProfile } from '../redux/features/captainSlice'

const ProtectedRoute = () => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { profile } = useSelector(state => state.captain);

  useEffect(() => {

    const fetchCaptainProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/captain/profile`,{
          withCredentials: true 
        });

        if (response.data.success) {
          dispatch(setCaptainProfile(response.data.data.captain));
          setLoading(false);
        }
      } catch (error) {
        if(error.response.status === 401){
          try {
            const refreshResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/captain/refresh-token`,{
              withCredentials: true 
            });
  
            if (refreshResponse.data.success) {
              dispatch(setCaptainProfile(refreshResponse.data.data.captain));
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
          }
        }

        dispatch(setCaptainProfile(null));
        setLoading(false);
      }
    }

    fetchCaptainProfile();
  },[]);

  if(loading){
    return (
      <div className='w-full'> 
        <div className='w-[95%] md:w-[80%] px-2 py-4 mt-15 mx-auto border'>
          <h3 className='text-xl font-semibold'>Loading...</h3> 
          <p className='text-lg text-gray-500'>Please wait while the page is being loaded.</p>
        </div>
      </div>
    )
  }
  
  return profile ? <Outlet /> : <Navigate to='/captain-login' />
}

export default ProtectedRoute