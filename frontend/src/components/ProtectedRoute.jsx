import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { setUserProfile } from '../redux/features/userSlice'

const ProtectedRoute = () => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { profile } = useSelector(state => state.user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/profile`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          dispatch(setUserProfile(response.data.data.user));
          setLoading(false);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshResponse = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/v1/user/refresh-token`,
              { withCredentials: true }
            );
            
            if (refreshResponse.data.success) {
              dispatch(setUserProfile(refreshResponse.data.data.user));
              setLoading(false);
              return;
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        dispatch(setUserProfile(null));
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


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

  return profile ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute