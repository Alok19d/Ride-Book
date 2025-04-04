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
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/profile`,{
      withCredentials: true 
    }).then((response => {
      if(response.data.success){
        dispatch(setUserProfile(response.data.data.user));
        setLoading(false);
      }
    }))
    .catch((err)=>{
      if(err.response.data.statusCode === 401){
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/refresh-token`,{
          withCredentials: true 
        }).then(response => {
          console.log(response);
          dispatch(setUserProfile(response.data.data.user));
          setLoading(false);
        })
        .catch(() => {
          dispatch(setUserProfile(null));
          setLoading(false);
        })
      }
      else{
        dispatch(setUserProfile(null));
        setLoading(false);
      }
    })
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

  return profile ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute