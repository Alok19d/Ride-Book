import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import {APIProvider, Map} from '@vis.gl/react-google-maps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faClock, faIndianRupeeSign, faCar } from '@fortawesome/free-solid-svg-icons'
import CaptainNavbar from '../components/CaptainNavbar'
import socket from '../config/socket';

const CaptainHome = () => {
  
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rides,setRides] = useState([]);
  const [currentRide,setCurrentRide] = useState(null);

  const { profile } = useSelector(state => state.captain);

  useEffect(() => {
    socket.emit("join", {userType: "captain", userId: profile._id});

    const handleNewRide = (data) => {
      console.log(data);
      setRides(prevRides => {
        // Check if ride already exists
        const rideExists = prevRides.some(ride => ride._id === data._id);
        if (rideExists) return prevRides;
        return [...prevRides, data];
      });
    };

    socket.on('new-ride', handleNewRide);
    
    const updateLocation = () => {  
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        return;
      }
      
      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("update-captain-location", {
          captainId: profile._id,
          location:{
            ltd: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      })
    }

    const locationInterval = setInterval(updateLocation, 30000);

    return () => {
      socket.off('new-ride');
      clearInterval(locationInterval)
    };
  }, []);

  function acceptRide(idx){
    setCurrentRide(rides[idx]);
    setStep(2);
  }

  function rejectRide(idx) {
    setRides(prevRides => prevRides.filter((_, index) => index !== idx));
  }

  function cancelRide(){
    setCurrentRide(null);
    setStep(1);
  }

  async function confirmRide(){
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/ride/accept-ride`,
        {
           rideId: currentRide._id  
        },
        {
          withCredentials: true
        }
      );
      
      if(response.data.success){
        console.log(response.data);
        navigate(`/captain-ride?rideId=${response.data.data.ride._id}`, {
          state: {
            ride: response.data.data.ride
          }
        });
        setStep(3);
      }
    } catch(error){
      console.log(error);
    }

  }

  return (
    <>
      <CaptainNavbar />
      <main className='home'>
        <section className='landing'>
          <div className='container landing-container'>
            <div className='ride-info'>
              <div className='new-ride-container h-full p-4'>
                {step === 1 && (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl font-semibold'>Available Rides</h2>
                      <div className='flex items-center gap-2 text-blue-600'>
                        <FontAwesomeIcon icon={faCar} />
                        <span className='text-sm font-medium'>{rides.length} rides</span>
                      </div>
                    </div>

                    {rides.length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <div className='w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                          <FontAwesomeIcon className='text-2xl text-gray-400' icon={faCar} />
                        </div>
                        <p className='text-gray-500 font-medium'>No rides available</p>
                        <p className='text-gray-400 text-sm'>New ride requests will appear here</p>
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        {rides.map((item, idx) => (
                          <div 
                            key={item._id} 
                            className='p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow'
                          >
                            <div className='space-y-3'>
                              <div className='flex items-start gap-3'>
                                <div className='w-2 h-2 mt-2 rounded-full bg-green-500'></div>
                                <div>
                                  <p className='font-medium'>Pickup</p>
                                  <p className='text-gray-600 text-sm'>{item.pickup}</p>
                                </div>
                              </div>
                              <div className='flex items-start gap-3'>
                                <div className='w-2 h-2 mt-2 rounded-full bg-red-500'></div>
                                <div>
                                  <p className='font-medium'>Drop-off</p>
                                  <p className='text-gray-600 text-sm'>{item.destination}</p>
                                </div>
                              </div>
                            </div>

                            <div className='mt-4 pt-3 border-t flex items-center justify-between'>
                              <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                  <FontAwesomeIcon icon={faClock} />
                                  <span className='text-sm'>{item.duration}</span>
                                </div>
                                <div className='flex items-center gap-2 text-gray-600'>
                                  <FontAwesomeIcon icon={faLocationDot} />
                                  <span className='text-sm'>{item.distance}</span>
                                </div>
                              </div>
                              <div className='flex items-center gap-1 text-green-600 font-semibold'>
                                <FontAwesomeIcon icon={faIndianRupeeSign} />
                                <span>{item.fare}</span>
                              </div>
                            </div>

                            <div className='flex gap-3 mt-4'>
                              <button 
                                className='flex-1 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors'
                                onClick={() => acceptRide(idx)}
                              >
                                Accept
                              </button>
                              <button 
                                className='flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors'
                                onClick={() => rejectRide(idx)}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className='space-y-4'>
                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <h2 className='text-lg font-semibold mb-3'>Ride Details</h2>
                      <div className='space-y-3'>
                        <div className='flex items-start gap-3'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-green-500'></div>
                          <div>
                            <p className='font-medium'>Pickup</p>
                            <p className='text-gray-600 text-sm'>{currentRide.pickup}</p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-red-500'></div>
                          <div>
                            <p className='font-medium'>Drop-off</p>
                            <p className='text-gray-600 text-sm'>{currentRide.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className='mt-4 pt-3 border-t flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <FontAwesomeIcon icon={faClock} />
                            <span className='text-sm'>10 min</span>
                          </div>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className='text-sm'>2.5 km</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-1 text-green-600 font-semibold'>
                          <FontAwesomeIcon icon={faIndianRupeeSign} />
                          <span>{currentRide.fare}</span>
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <button 
                        className='flex-1 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors'
                        onClick={confirmRide}
                      >
                        Confirm Ride
                      </button>
                      <button 
                        className='flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors'
                        onClick={cancelRide}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='google-map border'>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map 
                  mapId='2f77cdffe04d575f'
                  defaultZoom={12} 
                  defaultCenter={{lat: 28.6139, lng: 77.2088}}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                  }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    cameraControl: false,
                  }}
                  gestureHandling={'greedy'}
                >
                {/* <AdvancedMarker position={{lat: 29.5, lng: -81.2}} /> */}
                </Map>
              </APIProvider>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default CaptainHome