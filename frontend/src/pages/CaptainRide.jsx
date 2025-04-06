import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate ,useLocation, useSearchParams } from 'react-router-dom' 
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faClock, faIndianRupeeSign, faCheck } from '@fortawesome/free-solid-svg-icons'
import CaptainNavbar from '../components/CaptainNavbar';
import Directions from '../components/Directions';

const CaptainRide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rideId = searchParams.get("rideId");
  const [ride, setRide] = useState(location.state?.ride);
  const [route, setRoute] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [center, setCenter] = useState({lat: 28.6139, lng: 77.2088});
  const [step, setStep] = useState(1);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  async function startRide(){
    if(!otp){
      return;
    }

    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/ride/start-ride`,
        {
           rideId: ride._id ,
           otp: otp.join('')
        },
        {
          withCredentials: true
        }
      );
      
      if(response.data.success){
        console.log(response.data);
        setStep(2);
      }
    } catch(error){
      console.log(error);
    }
  };

  async function finishRide(){
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/ride/end-ride`,
        {
          rideId: ride._id,
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
  };

  return (
    <>
      <CaptainNavbar />
      <main>
        <section>
          <div className='container ride-container'>
            <div className='ride-info'>
              <div className='ride-form-container'>
                {step === 1 && (
                  <div className='space-y-6'>
                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
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

                      <div className='mt-4 pt-3 border-t flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <FontAwesomeIcon icon={faClock} />
                            <span className='text-sm'>{ride.duration}</span>
                          </div>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className='text-sm'>{ride.distance}</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-1 text-green-600 font-semibold'>
                          <FontAwesomeIcon icon={faIndianRupeeSign} />
                          <span>{ride.fare}</span>
                        </div>
                      </div>
                    </div>
                    

                    <div className='text-center'>
                      <h2 className='text-xl font-semibold mb-2'>Verify OTP</h2>
                      <p className='text-gray-600'>Please enter the OTP shared by the passenger</p>
                    </div>

                    <div className='flex justify-center gap-2'>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type='text'
                          name={`otp-${index}`}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className='w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          maxLength={1}
                        />
                      ))}
                    </div>

                    <button 
                      className='w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors'
                      onClick={startRide}
                    >
                      Start Ride
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className='space-y-4'>
                    <div className='p-4 border rounded-lg bg-white shadow-sm'>
                      <h2 className='text-lg font-semibold mb-3'>Ride in Progress</h2>
                      
                      {/* User Details */}
                      <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-semibold text-lg'>
                              {ride.user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className='font-medium'>{ride.user?.name || 'User'}</p>
                            <p className='text-gray-600 text-sm'>{ride.user?.phone || 'No phone number'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Ride Details */}
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

                      <div className='mt-4 pt-3 border-t flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <FontAwesomeIcon icon={faClock} />
                            <span className='text-sm'>{ride.duration}</span>
                          </div>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className='text-sm'>{ride.distance}</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-1 text-green-600 font-semibold'>
                          <FontAwesomeIcon icon={faIndianRupeeSign} />
                          <span>{ride.fare}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className='w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
                      onClick={finishRide}
                    >
                      Finish Ride
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className='space-y-4'>
                    <div className='p-6 border rounded-lg bg-white shadow-sm text-center'>
                      <div className='w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center'>
                        <FontAwesomeIcon className='text-3xl text-green-500' icon={faCheck} />
                      </div>
                      <h2 className='text-xl font-semibold mb-0.5'>Trip Completed!</h2>
                      <p className='text-gray-600'>Great job for completing another trip</p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Trip Duration</span>
                          <span className='font-medium'>{ride.duration}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Distance</span>
                          <span className='font-medium'>{ride.distance}</span>
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

                    <button 
                      className='w-full btn-1'
                      onClick={() => navigate('/captain-home')}
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

export default CaptainRide