import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faLocationDot, faCrosshairs, faLocationCrosshairs, faLock } from '@fortawesome/free-solid-svg-icons'
import { debounce } from "lodash";
import socket from '../config/socket'

import Navbar from '../components/Navbar'
import Directions from '../components/Directions'


const Home = () => {  

  const navigate = useNavigate();
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [rideData, setRideData] = useState({
    pickup: '',
    destination: '',
    vehicleType: '',
    paymentMode: ''
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  
  const center = {lat: 28.6139, lng: 77.2088};
  const [journeyDetails, setJourneyDetails] = useState(null);

  const { profile } = useSelector(state => state.user);


  /* Join to WebSocket when Component Re renders */
  useEffect(() => {
    socket.emit("join", {userType: "user", userId: profile._id});
  }, []);
  
  /* Fetch Ride Fare, Distance and Duration */
  const fetchRideFare = debounce(async(pickup, destination, setJourneyDetails) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/ride/get-fare`,{
        params: { 
          pickup, destination 
        },
        withCredentials: true 
      });   

      if(response.status === 200){
        setJourneyDetails(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    
  }, 500); 

  /* Fetch fare if both Pickup and Destination is provided */
  useEffect(() => {
    if(rideData.pickup.length >= 3 && rideData.destination.length >= 3){
      fetchRideFare(rideData.pickup, rideData.destination, setJourneyDetails);
    }

    return () => {
      fetchRideFare.cancel();
    }
  }, [rideData]);

  /* Fetch Suggestions for Pickup/ Destination */
  async function fetchSuggestions(input, type){
    if (!input || input.length < 3) return;
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/map/get-suggestions`,{
        params: { input },
        withCredentials: true 
      });

      if (type === 'pickup') {
        setPickupSuggestions(response.data.data.suggestions);
      } else {
        setDestinationSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }

  const handleSearch = debounce((input, type) => {
    fetchSuggestions(input, type);
  }, 300);

  /* Handle Pickup Searches */
  function handlePickupSearch(){
    handleSearch(pickupRef.current.value, 'pickup');
  }
  
  /* Handle Destination Searches */
  function handleDestinationSearch(){
    handleSearch(destinationRef.current.value, 'destination');
  }

  /* Handle change in rideData pickup values */
  function handlePickupChange(e){
    setRideData(prev => ({
      ...prev,
      pickup: e.target.innerHTML
    }));
    pickupRef.current.value = e.target.innerHTML;
    setPickupSuggestions([]);
  }  

  function handleDestinationChange(e){
    setRideData(prev => ({
      ...prev,
      destination: e.target.innerHTML
    }));
    destinationRef.current.value = e.target.innerHTML;
    setDestinationSuggestions([]);
  }  

  const handleVehicleSelect = (vehicle) => {
    setRideData(prev => ({
      ...prev,
      vehicleType: vehicle
    }));
  };

  /* Fetches User current location and set it to Pickup Location */
  async function handleCurrentLocation(){
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude}, ${longitude}`;

        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/map/reverse-geocode`,{
          params: { 
            input: location
          },
          withCredentials: true 
        }).then((response) => {
          setRideData(prev => ({
            ...prev,
            pickup: response.data.data.address
          }));
          pickupRef.current.value = response.data.data.address;
          setPickupSuggestions([]);
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please try again or select from suggestions.');
      }
    );
  }

  function requestRideHandler(e){
    e.preventDefault();

    const pickup = rideData.pickup.split(' ').join('');
    const destination = rideData.destination.split(' ').join('');

    if(pickup.length < 3){
      setError('Please select a valid Pickup Location');
      return;
    }

    if(destination.length < 3){
      setError('Please select a valid Destination Location');
      return;
    }

    if(!rideData.vehicleType){
      setError('Please select a Vehicle Type');
      return;
    }

    setError('');
    setStep(2);
  }

  async function confirmRideHandler(){
    if(!rideData.paymentMode){
      setError('Please select a Payment Mode');
      return;
    }

    setError('');
    /* Make API call and navigate*/
    try{
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/ride/create`,
        {
          pickup: rideData.pickup,
          destination: rideData.destination,
          vehicleType: rideData.vehicleType,      
          paymentMode: rideData.paymentMode,      
        },
        {
          withCredentials: true
        }
      );
      setLoading(false);
      if(response.data.success){
        navigate(`/ride?rideId=${response.data.data.ride._id}`, {
          state: {
            ride: response.data.data.ride
          }
        });
      }
    }catch(err){
      setLoading(false);
      setError(err.response.data.message);
    }
  }

  return (
    <>
      <Navbar />  
      <main className='home'>
        <section className='landing'>
          <div className='container landing-container'>
            <div className='ride-info'>
              <div className='ride-form-container'>
              {
                step === 1 ? (
                  /* Step 1: Ride Information */
                  <form>
                    <div className='input-box landing-inp'>
                      <label>
                        Pickup
                      </label>
                      <input 
                        type='text'
                        ref={pickupRef}
                        className='peer'
                        onChange={handlePickupSearch} 
                        placeholder='Pickup Location'
                        required
                      />
                      <FontAwesomeIcon icon={faCircle} />
                      <div 
                        className={`suggestions invisible peer-focus:visible`}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <div 
                          className='flex items-center py-1 border-b cursor-pointer hover:bg-gray-100'
                          onClick={handleCurrentLocation}
                        >
                          <FontAwesomeIcon 
                            icon={faLocationCrosshairs} 
                            className='pr-2'  
                          />
                          Your Current Location
                        </div>
                        <div className='flex items-center py-1 border-b'>
                          <FontAwesomeIcon 
                            icon={faCrosshairs} 
                            className='pr-2'  
                          />
                          Choose on map
                        </div>
                        {
                          pickupSuggestions.length!==0 ? 
                          pickupSuggestions.map((item) => (
                            <p 
                              name='pickup-suggestion'
                              key={item.place_id} 
                              onClick={handlePickupChange}
                            >
                              {item.description}
                            </p>
                          ))
                          :
                          <p className='text-center text-gray-400 mt-2'>No search results</p>
                        }
                      </div>
                    </div>
                    <div className='input-box landing-inp'>
                      <label>
                        Destination
                      </label>
                      <input 
                        type='text' 
                        ref={destinationRef}
                        className='peer'
                        onChange={handleDestinationSearch}
                        placeholder='Destination Location'
                        required
                      />
                      <div 
                        className={`suggestions invisible ${destinationSuggestions.length!==0 ? 'peer-focus:visible': ''}`}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {
                          destinationSuggestions.map((item) => (
                            <p 
                              key={item.place_id} 
                              onClick={handleDestinationChange}
                            >
                              {item.description}
                            </p>
                          ))
                        }
                      </div>
                      <FontAwesomeIcon icon={faLocationDot} />
                    </div>
                    
                    {/* Choose Vehicle Type */}
                    <div className='hide-on-mobile space-y-3'>
                      <h2 className='text-lg font-semibold'>Choose Vehicle Type</h2>
                      <div 
                        className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${rideData.vehicleType === 'auto' ? 'outline outline-black' : ''}`}
                        onClick={() => handleVehicleSelect('auto')}
                      >
                        <div className='flex gap-5'>
                          <img 
                            src='/auto.png'
                            className='w-15'
                          />
                          <div>
                            <p className='font-semibold'>Auto</p>
                            <p>4 min away</p>
                          </div>
                        </div>
                        <p className='font-semibold'>₹ {journeyDetails ? journeyDetails.fare.auto : '-- --' }</p>
                      </div>
                      <div 
                        className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${rideData.vehicleType === 'motorcycle' ? 'outline outline-black' : ''}`}
                        onClick={() => handleVehicleSelect('motorcycle')}
                      >
                        <div className='flex gap-5'>
                          <img 
                            src='/motorcycle.png'
                            className='w-15'
                          />
                          <div>
                            <p className='font-semibold'>Motorcycle</p>
                            <p>4 min away</p>
                          </div>
                        </div>
                        <p className='font-semibold'>₹ {journeyDetails ? journeyDetails.fare.motorcycle : '-- --'}</p>
                      </div>
                      <div 
                        className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${rideData.vehicleType === 'car' ? 'outline outline-black' : ''}`}
                        onClick={() => handleVehicleSelect('car')}
                      >
                        <div className='flex gap-5'>
                          <img 
                            src='/car.png'
                            className='w-15'
                          />
                          <div>
                            <p className='font-semibold'>Car</p>
                            <p>4 min away</p>
                          </div>
                        </div>
                        <p className='font-semibold'>₹ {journeyDetails ? journeyDetails.fare.car: '-- --'}</p>
                      </div>
                      <p className='text-red-600 pl-1 mb-0 text-sm'>
                        {error}
                      </p>
                      <button 
                        className='btn-1'
                        onClick={requestRideHandler}
                      >
                        Request Ride
                      </button>
                    </div>
                  </form>
                  )
                : (
                  /* Step 2: Payment Information */
                  <>
                    <div className='p-2 mb-5 space-y-1 border rounded'>
                      <h2 className='mb-1 text-lg font-semibold'>Ride Summary</h2>

                      <p><span className='font-semibold'>Pickup:</span> {rideData.pickup}</p>
                      <p><span className='font-semibold'>Destination:</span> {rideData.destination}</p>
                      <p>
                        <span className='font-semibold pr-1'>
                          Ride Fare: 
                        </span>
                        ₹{journeyDetails?.fare[rideData.vehicleType]}</p>
                    </div>

                    <div className='hide-on-mobile '>
                      <div className='mb-5'>
                        <h2 className='mb-1 text-lg font-semibold'>Select Payment Method</h2>
                        <div 
                          className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${rideData.paymentMode === 'cash' ? 'outline outline-black' : ''}`}
                          onClick={() => setRideData({...rideData, paymentMode: 'cash'})}
                        >
                          <div className='flex gap-5'>
                            <img 
                              src='/dollar.png'
                              className='w-15'
                            />
                            <div>
                              <p className='font-semibold'>Cash</p>
                              <p>Pay directly to driver</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className='text-red-600 pl-1 mb-0 text-sm'>
                        {error}
                      </p>

                      <button 
                        className={`btn-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={confirmRideHandler}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faLock} className='pr-3' />
                        Pay and Confirm Ride
                      </button>
                    </div>
                  </>
                  )
              }
              </div>
            </div>
            <div className='relative google-map border'>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map 
                  mapId='2f77cdffe04d575f'
                  defaultZoom={12} 
                  defaultCenter={center}
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
                    !(rideData.pickup || rideData.destination) &&
                    <AdvancedMarker position={center}>
                      <img src='/pin.png' width={32} height={32}/>
                    </AdvancedMarker>
                  }
                  {
                    rideData.pickup && rideData.destination && (
                      <Directions 
                        pickup={rideData.pickup} 
                        destination={rideData.destination}
                      />
                    )
                  }
                </Map>
              </APIProvider>
              {
                journeyDetails &&
                <div className='bg-white absolute bottom-2 lg:bottom-8 left-4 px-2 py-1 border rounded'>
                  <p><span className='font-semibold'>Distance: {journeyDetails?.distance}</span> </p>
                  <p><span className='font-semibold'>Duration: {journeyDetails?.duration}</span> </p>
                </div>
              }
            </div>
            <div className='view-on-mobile mt-5'>
              {
                step === 1 ? (
                  <>
                    <h2 className='text-lg font-semibold mb-1'>Choose Ride Type</h2>
                    <div className='flex justify-between mb-3'>
                      <div 
                        className={`flex flex-col items-center border px-5 py-1 rounded-lg ${rideData.vehicleType === 'auto' ? 'outline outline-black' : ''}`}
                        onClick={() => handleVehicleSelect('auto')}
                      >
                        <img 
                          src='/auto.png'
                          className='w-12'
                        />
                        <p>Auto</p>
                      </div>
                      <div 
                        className={`flex flex-col items-center border px-5 py-1 rounded-lg ${rideData.vehicleType === 'motorcycle' ? 'outline outline-black' : ''}`}
                        onClick={() => handleVehicleSelect('motorcycle')}
                      >
                        <img 
                          src='/motorcycle.png'
                          className='w-12'
                        />
                        <p>Motorcycle</p>
                      </div>
                      <div 
                        className={`flex flex-col items-center border px-5 py-1 rounded-lg ${rideData.vehicleType === 'car' ? 'outline outline-black' : ''}`}
                        onClick={() => handleVehicleSelect('car')}
                      >
                        <img 
                          src='/car.png'
                          className='w-12'
                        />
                        <p>Car</p>
                      </div>
                    </div>
                    <p className='text-red-600 pl-1 mb-0 text-sm'>
                      {error}
                    </p>
                    <button 
                      className='btn-1'
                      onClick={requestRideHandler}
                    >
                      Request Ride
                    </button>
                  </>
                )
                : (
                  <>
                    <h2 className='text-lg font-semibold mb-1'>Select Payment Method</h2>
                    <div className='flex justify-between mb-3'>
                      <div 
                        className={`flex flex-col items-center border px-5 py-1 rounded-lg ${rideData.paymentMode === 'cash' ? 'outline outline-black' : ''}`}
                        onClick={() => setRideData({...rideData, paymentMode: 'cash'})}
                      >
                        <img 
                          src='/dollar.png'
                          className='w-12'
                        />
                        <p>Cash</p>
                      </div>
                    </div>
                    <p className='text-red-600 pl-1 mb-0 text-sm'>
                      {error}
                    </p>
                    <button 
                      className={`btn-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={confirmRideHandler}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faLock} className='pr-3' />
                      Pay and Confirm Ride
                    </button>
                  </>
                )
              }
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home