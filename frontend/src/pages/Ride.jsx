import {useEffect, useState} from 'react'
import { useNavigate ,useLocation, useSearchParams } from 'react-router-dom' 
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faMessage, faMagnifyingGlass, faCar, faStar, faStarHalfStroke, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Directions from '../components/Directions';
import socket from '../config/socket';

const Ride = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rideId = searchParams.get("rideId");
  const [ride, setRide] = useState(location.state?.ride);

  const [route, setRoute] = useState(null);

  const center = {lat: 28.6139, lng: 77.2088};
  const [step, setStep] = useState(1);

  useEffect(() => {
    if(!ride || !rideId){
      console.log("No Ride Found");
      navigate('/');
    }

    if(ride){
      setRoute({
        pickup: ride.pickup,
        destination: ride.destination
      })
    }

    socket.on('ride-accepted', (data) => {
      data.otp = ride.otp;
      console.log(data);
      setRide(data);
      setRoute({
        pickup: `${data.captain.location.ltd} ${data.captain.location.lng}`,
        destination: data.pickup
      })
      setStep(2);
    });

    socket.on('ride-started', (data) => {
      setStep(3);
      setRoute({
        pickup: `${data.captain.location.ltd} ${data.captain.location.lng}`,
        destination: data.destination
      });
    });

    socket.on('ride-ended', () => {
      setStep(4);
    });

    return () => {
      socket.off('ride-accepted');
      socket.off('ride-started');
      socket.off('ride-ended');
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className='container ride-container'>
            <div className='ride-info'>
              <div className='ride-form-container'>
                {step === 1 && (
                  <div className='space-y-4'>
                    <div className='flex flex-col items-center p-4 bg-blue-50 rounded-lg'>
                      <div className='mb-3 p-3 bg-white rounded-full shadow-sm'>
                        <FontAwesomeIcon className='text-3xl text-blue-600' icon={faMagnifyingGlass} />
                      </div>
                      <h2 className='text-xl font-semibold text-blue-900'>Finding Your Driver</h2>
                      <p className='text-blue-700 text-sm text-center'>We're connecting you with the best available driver nearby</p>

                      <div className='w-full mt-4 bg-white rounded-full h-2 overflow-hidden'>
                        <div className='h-full bg-blue-600 animate-pulse' style={{width: '80%'}}></div>
                      </div>
                    </div>

                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <div className='flex justify-between items-center mb-3'>
                        <h2 className='text-lg font-semibold'>Ride Details</h2>
                        <div className='flex items-center gap-2 text-blue-600'>
                          <FontAwesomeIcon icon={faCar} />
                          <span className='text-sm font-medium'>Est. 10min</span>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <div className='flex items-start gap-3'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-green-500'></div>
                          <div>
                            <p className='font-medium'>Pickup</p>
                            <p className='text-gray-600 text-sm'>{ride.pickup}</p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-red-500'></div>
                          <div>
                            <p className='font-medium'>Drop-off</p>
                            <p className='text-gray-600 text-sm'>{ride.destination}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      className='w-full btn-1 bg-red-500 hover:bg-red-600'
                      onClick={() => navigate('/')}
                    >
                      Cancel Ride
                    </button>
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
                            <p className='text-gray-600 text-sm'>{ride.pickup}</p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-red-500'></div>
                          <div>
                            <p className='font-medium'>Drop-off</p>
                            <p className='text-gray-600 text-sm'>{ride.destination}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <h2 className='text-lg font-semibold mb-1'>Share OTP with Driver</h2>
                      <div className='bg-gray-50 p-2 rounded-lg text-center'>
                        <p className='text-gray-600 text-sm mb-2'>One Time Password</p>
                        <p className='text-4xl font-bold tracking-widest text-blue-600'>{ride.otp}</p>
                      </div>
                    </div>

                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <div className='flex items-center gap-4'>
                        <img 
                          className='w-16 h-16 rounded-full object-cover border-2 border-blue-500' 
                          src='https://sudoku-master.vercel.app/Avatar_01.png'
                          alt="Driver"
                        />
                        <div className='flex-1'>
                          <p className='font-semibold text-lg'>{ride.captain?.name || 'Driver Name'}</p>
                          <p className='text-gray-600 text-sm'>{ride.captain?.vehicleNumber || 'Vehicle Number'}</p>
                          <div className='flex gap-4 mt-2'>
                            <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'>
                              <FontAwesomeIcon icon={faPhone} />
                            </button>
                            <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'>
                              <FontAwesomeIcon icon={faMessage} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      className='w-full btn-1 bg-red-500 hover:bg-red-600'
                      onClick={() => navigate('/')}
                    >
                      Cancel Ride
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className='space-y-4'>
                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <div className='flex items-center gap-4 mb-4'>
                        <img 
                          className='w-16 h-16 rounded-full object-cover border-2 border-blue-500' 
                          src='https://sudoku-master.vercel.app/Avatar_01.png'
                          alt="Driver"
                        />
                        <div>
                          <p className='font-semibold text-lg'>{ride.captain?.name || 'Driver Name'}</p>
                          <div className='flex items-center gap-2'>
                            <div className='flex text-yellow-400'>
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStarHalfStroke} />
                            </div>
                            <span className='text-sm text-gray-600'>4.8 (2.5k rides)</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                        <div className='flex items-center gap-3'>
                          <FontAwesomeIcon className='text-2xl text-blue-600' icon={faCar} />
                          <div>
                            <p className='font-medium'>{ride.captain?.vehicleModel || 'Vehicle Model'}</p>
                            <p className='text-sm text-gray-600'>{ride.captain?.vehicleNumber || 'Vehicle Number'}</p>
                          </div>
                        </div>
                        <div className='px-3 py-1 bg-white rounded-full text-sm font-medium'>
                          {ride.captain?.vehicleColor || 'Silver'}
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <button className='flex-1 btn-1 flex items-center justify-center gap-2'>
                        <FontAwesomeIcon icon={faPhone} />
                        Call
                      </button>
                      <button className='flex-1 btn-1 flex items-center justify-center gap-2'>
                        <FontAwesomeIcon icon={faMessage} />
                        Message
                      </button>
                    </div>

                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <div className='flex justify-between items-center mb-4'>
                        <div>
                          <h2 className='text-lg font-semibold'>Trip Progress</h2>
                          <p className='text-sm text-gray-600'>8 mins to destination</p>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold'>2.5 km</p>
                          <p className='text-sm text-gray-600'>remaining</p>
                        </div>
                      </div>

                      <div className='relative pl-4'>
                        <div className='absolute -left-1 top-0 bottom-0 w-1.5 border border-gray-300 rounded'>
                          {/* <div className='w-full h-[80%] bg-blue-500'>
                          </div> */}
                        </div>
                        
                        <div className='relative mb-6'>
                          <div className='absolute -left-6 top-1 w-3 h-3 rounded-full bg-green-500'></div>
                          <p className='font-medium'>{ride.pickup}</p>
                          <p className='text-sm text-gray-600'>Picked up at 10:30 AM</p>
                        </div>

                        <div className='relative'>
                          <div className='absolute -left-6 top-1 w-3 h-3 rounded-full bg-red-500'></div>
                          <p className='font-medium'>{ride.destination}</p>
                          <p className='text-sm text-gray-600'>ETA 10:50 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className='space-y-4'>
                    <div className='p-6 border rounded-lg bg-white shadow-sm text-center'>
                      <div className='w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center'>
                        <FontAwesomeIcon className='text-3xl text-green-500' icon={faCheck} />
                      </div>
                      <h2 className='text-xl font-semibold mb-0.5'>Ride Completed!</h2>
                      <p className='text-gray-600'>Thank you for riding with us</p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Trip Duration</span>
                          <span className='font-medium'>18 minutes</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Distance</span>
                          <span className='font-medium'>3.2 km</span>
                        </div>
                      </div>
                    </div>

                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <h2 className='text-lg font-semibold mb-3'>Trip Details</h2>
                      <div className='space-y-4'>
                        <div className='flex items-start gap-4'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-green-500'></div>
                          <div>
                            <p className='font-medium'>{ride.pickup}</p>
                            <p className='text-sm text-gray-600'>Pickup - 10:30 AM</p>
                          </div>
                        </div>
                        <div className='flex items-start gap-4'>
                          <div className='w-2 h-2 mt-2 rounded-full bg-red-500'></div>
                          <div>
                            <p className='font-medium'>{ride.destination}</p>
                            <p className='text-sm text-gray-600'>Drop-off - 10:48 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <h2 className='text-lg font-semibold mb-3'>Payment Summary</h2>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Base Fare</span>
                          <span>₹{ride.fare - 3}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Platform Fee</span>
                          <span>₹3</span>
                        </div>
                        <div className='flex justify-between font-medium pt-2 border-t'>
                          <span>Total</span>
                          <span>₹{ride.fare}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className='w-full btn-1'
                      onClick={() => navigate('/')}
                    >
                      Return to Home
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className='relative google-map border'>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map 
                  mapId='2f77cdffe04d575f'
                  defaultCenter={center}
                  defaultZoom={12} 
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
                  gestureHandling='cooperative'
                >
                  {
                    route?.pickup && route?.destination && (
                      <Directions 
                        pickup={route?.pickup} 
                        destination={route?.destination}
                      />
                    )
                  }
                </Map>
              </APIProvider>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Ride