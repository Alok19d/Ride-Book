import {useEffect, useState} from 'react'
import { useNavigate ,useLocation, useSearchParams } from 'react-router-dom' 
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faMessage, faMagnifyingGlass, faCar, faStar, faStarHalfStroke, faCheck,  faCircle, faLocationDot } from '@fortawesome/free-solid-svg-icons';
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
      console.log(data);
      setStep(2);
    });

    socket.on('ride-started', (data) => {
      setStep(3);
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
                {
                  step === 1 && (
                    <div>
                      <div className='flex flex-col items-center mb-4 px-3'>
                        <div className='mb-3 search-icon'>
                          <FontAwesomeIcon className='text-3xl text-blue-700' icon={faMagnifyingGlass} />
                        </div>
                        <h2 className='mb-1 text-xl font-semibold'>Looking for nearby drivers</h2>
                        <p className='text-center'>We're connecting you with the best availiable driver</p>

                        <div className='h-3 w-full my-5 border rounded'>
                          <div>
                            <div className='h-3 w-[80%] bg-blue-600'></div>
                          </div>
                        </div>
                      </div>

                      <div className='p-3 border border-gray-400 rounded'>
                        <div className='flex justify-between'>
                          <h2 className='text-lg font-semibold'>Ride Details</h2>
                          <p className='text-gray-600'>Est. 10min</p>
                        </div>
                        <p><span className='font-semibold'>Pickup:</span> {ride.pickup}</p>
                        <p><span className='font-semibold'>DropOff:</span> {ride.destination}</p>
                      </div>
                    </div>
                  )
                }
                {
                  step === 2 && (
                    <div>
                      <div className='mb-5'>
                        <h2 className='text-lg font-semibold'>Ride Details</h2>

                        <div className='p-2 border border-gray-300 rounded'>
                          <p><span className='font-semibold'>Pickup:</span> {ride.pickup}</p>
                          <p><span className='font-semibold'>DropOff:</span> {ride.destination}</p>
                        </div>  
                      </div>
                      <h2 className='mb-1 text-lg font-semibold'>Ride Confirmation</h2>
                      <div className='p-2 mb-5 border border-gray-300 rounded '>
                        <p>
                          One Time Password: 
                        </p>
                        <p className='py-3 text-4xl text-center font-bold'>
                          {ride.otp}
                        </p>
                      </div>
                      <div className='flex items-center p-2 mb-5 space-x-3 border border-gray-300 rounded'>
                        <img className='w-15 h-15' src='https://sudoku-master.vercel.app/Avatar_01.png'/>
                        <div>
                          <p className='font-semibold'>Alok Anand</p>
                          <p>BR 12 H 3455</p>
                          <div className='space-x-3'>
                            <FontAwesomeIcon icon={faPhone} />
                            <FontAwesomeIcon icon={faMessage} />
                          </div>
                        </div>
                      </div>
                      <button className='btn-1'>Cancel Ride</button>
                    </div> 
                  )
                }
                {
                  step === 3 && (
                    <div>
                      <div className='flex mb-5'>
                        <img className='w-12 mr-3' src='https://sudoku-master.vercel.app/Avatar_01.png'/>
                        
                        <div>
                          <p className='font-semibold'>Michel Chen</p>
                          <div className='flex items-center'>
                            <div className='pr-3 text-yellow-500'>
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStarHalfStroke} />
                            </div>
                            <p>4.8 (2.5k rides)</p>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center '>
                          <FontAwesomeIcon className='fa-2xl mr-5' icon={faCar} />
                          <div>
                            <p className='font-semibold'>Toyata Canry</p>
                            <p>BR 12H 1234</p>
                          </div>
                        </div>
                        <div className='py-0.5 px-2 border rounded-2xl'>
                          Silver
                        </div>
                      </div>

                      <div className='flex justify-between my-5'>
                        <button className='basis-[48%] btn-1'>
                        <FontAwesomeIcon className='pr-2' icon={faPhone} />
                          Call
                        </button>
                                  
                        <button className='basis-[48%] btn-1'>
                          <FontAwesomeIcon className='pr-2' icon={faMessage}/>
                          Message
                        </button>
                      </div>

                      <div className='p-2 border rounded'>
                        <div className='flex justify-between mb-3'>
                          <div>
                            <h2 className='text-lg font-semibold'>Trip Progress</h2>
                            <p>8 mins to destination</p>
                          </div>
                          <div className='text-right'>
                            <p className='font-semibold'>2.5 km</p>
                            <p>remaining</p>
                          </div>
                        </div>

                        <div className='relative'>
                          <div className='mb-2'>
                            <p className='font-semibold'>{ride.pickup}</p>
                            <p>Picked up at 10:30 AM</p>
                          </div>

                          <div>
                            <p className='font-semibold'>{ride.destination}</p>
                            <p>ETA 10:50 AM</p>
                          </div>

                          <div className='h-full absolute top-1 right-1 overflow-hidden'>
                            <div className='h-[90%] w-3 border rounded'>
                              <div className='h-full'>
                                <div className='w-3 h-[70%] bg-black'></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  step === 4 && (
                    <div>
                      <div className='mb-3 flex flex-col items-center border-b border-gray-300'> 
                        <div className='py-5 px-5.5 mb-3 bg-green-200 rounded-full'>
                          <FontAwesomeIcon className='text-3xl text-green-500' icon={faCheck} />
                        </div>
                        <h2 className='text-xl font-semibold'>Ride Completed!</h2>
                        <p className='text-gray-500'>Thank you for riding with us</p>

                        <div className='w-full  p-3 font-semibold'>
                          <div className='flex justify-between'>
                            <p className='text-gray-500'>Trip Duration</p>
                            <p>18 minutes</p>
                          </div>
                          <div className='flex justify-between'>
                            <p className='text-gray-500'>Distance</p>
                            <p>3.2 km</p>
                          </div>
                        </div>
                      </div>

                      <div className='w-full p-3'>
                        <h2 className='text-lg font-semibold'>Trip Details</h2>

                        <div className='flex items-center mb-2'>
                          <FontAwesomeIcon className='text-xl mr-4' icon={faCircle}/>
                          <div>
                            <p>{ride.pickup}</p>
                            <p>Pickup - 10: 30 AM</p>
                          </div>
                        </div>

                        <div className='flex items-center'>
                          <FontAwesomeIcon className='text-2xl mr-4' icon={faLocationDot}/>
                          <div>
                            <p>{ride.destination}</p>
                            <p>Pickup - 10: 48 AM</p>
                          </div>
                        </div>
                      </div>

                      <div className='p-3'>
                        <h2 className='text-lg font-semibold'>Payment Summary</h2>
                        <div className='flex justify-between'>
                          <p>Base Fare</p>
                          <p>₹ {ride.fare - 3}</p>
                        </div>
                        <div className='flex justify-between'>
                          <p>Platform Fee</p>
                          <p>₹ 3</p>
                        </div>
                        <div className='flex justify-between'>
                          <p>Total</p>
                          <p>₹ {ride.fare}</p>
                        </div>
                      </div>

                      <button className='btn-1' onClick={()=>{navigate('/')}}>
                        Return to Home
                      </button>
                    </div>
                  )
                }
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