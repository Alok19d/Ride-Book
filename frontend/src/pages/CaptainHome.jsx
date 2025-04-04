import axios from 'axios'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import {APIProvider, Map} from '@vis.gl/react-google-maps'
import CaptainNavbar from '../components/CaptainNavbar'
import socket from '../config/socket';

const CaptainHome = () => {
  
  const [step, setStep] = useState(1);
  const [rides,setRides] = useState([]);
  const [currentRide,setCurrentRide] = useState(null);

  const { profile } = useSelector(state => state.captain);

  useEffect(() => {
    socket.emit("join", {userType: "captain", userId: profile._id});

    const handleNewRide = (data) => {
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
        setStep(3);
      }
    } catch(error){
      console.log(error);
    }

  }

  async function startRide() {
    
  }

  return (
    <>
      <CaptainNavbar />
      <main className='home'>
        <section className='landing'>
          <div className='container landing-container'>
            <div className='ride-info'>
              <div className='new-ride-container h-full p-2'>
                {
                  step === 1 &&
                  <div>
                    <h2 className='mb-2 text-lg font-semibold'>Availiable Rides</h2>
                    {
                      rides.length === 0 ?
                      <div>
                        <p className='text-center text-gray-400'>No ride Found</p>
                      </div>
                      :
                      <div>
                        {
                          rides.map((item, idx) => (
                              <div key={item._id} className='p-2 bg-white border rounded'>
                                <div className='flex justify-between items-center '>
                                  <div>
                                    <p><span>Pickup: </span> {item.pickup}</p>
                                    <p>Dropoff: {item.destination}</p>
                                  </div>
                                  <p className='font-semibold'>₹ {item.fare}</p>
                                </div>
                                <div className='flex justify-between mt-5'>
                                  <button className='basis-[48%] py-1 bg-green-600 text-white font-semibold border rounded' onClick={()=>{acceptRide(idx)}}>
                                    Accept
                                  </button>
                                  
                                  <button className='basis-[48%] py-1 bg-red-600 text-white font-semibold border rounded' onClick={()=>{rejectRide(idx)}}>
                                    Reject
                                  </button>
                                </div>
                              </div>
                          ))
                        }
                      </div>
                    }
                  </div>
                }
                {
                  step === 2 && 
                  <div>
                  <button className='btn-1' onClick={confirmRide}>Confirm Ride</button>
                  </div>
                }
                {
                  step === 3 &&
                  <div>
                    Ride confirmed
                    Enter OTP
                    Start Ride
                  </div>
                }
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