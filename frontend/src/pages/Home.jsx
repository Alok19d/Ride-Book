import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faLocationDot, faCrosshairs, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../components/Navbar'
import { debounce } from "lodash";
import socket from '../config/socket'

const Home = () => {
  
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  
  const [rideData, setRideData] = useState({
    pickup: '',
    destination: '',
    vehicleType: '',
  })
  
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  
  const [center, setCenter] = useState({lat: 28.6139, lng: 77.2088});

  const [fare, setFare] = useState(null);
  const [route, setRoute] = useState(null);

  const { profile } = useSelector(state => state.user);

  /* Join to WebSocket when Component Re renders */
  useEffect(() => {
    socket.emit("join", {userType: "user", userId: profile._id});
  }, []);
  
  const fetchRideDetails = debounce(async(pickup, destination, setFare) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/ride/get-fare`,{
        params: { 
          pickup, destination 
        },
        withCredentials: true 
      });
      
      const directions = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/map/get-direction`,{
        params: { pickup, destination },
        withCredentials: true 
      });

      console.log(directions.data.data.route.routes[0].overview_polyline.points);

      setRoute(directions.data.data.route.routes[0].overview_polyline.points);

      if(response.status === 200){
        setFare(response.data.data.fare);
      }
    } catch (error) {
      console.log(error);
    }
    
  }, 500); 

  /* Fetch fare if both Pickup and Destination is provided */
  useEffect(() => {
    if(rideData.pickup.length >= 3 && rideData.destination.length >= 3){
      fetchRideDetails(rideData.pickup, rideData.destination, setFare);
    }

    return () => {
      fetchRideDetails.cancel();
    }
  }, [rideData]);

  /* Fetch Suggestions  */
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


  function handlePickupSearch(){
    handleSearch(pickupRef.current.value, 'pickup');
  }
  
  function handleDestinationSearch(){
    handleSearch(destinationRef.current.value, 'destination');
  }

  /* Handle change in rideData values */
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

  /* Get user Location */
  async function handleCurrentLocation(){
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude}, ${longitude}`;

        setCenter({
          lat: latitude,
          lng: longitude
        });
        
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

    console.log(rideData);

    // socket.emit('requestRide', rideRequest);
  }

  return (
    <>
      <Navbar />  
      <main className='home'>
        <section className='landing'>
          <div className='container landing-container'>
            <div className='ride-info'>
              <div className='ride-form-container'>
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
                      <p className='font-semibold'>₹ {fare ? fare.auto : '-- --' }</p>
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
                      <p className='font-semibold'>₹ {fare ? fare.motorcycle : '-- --'}</p>
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
                      <p className='font-semibold'>₹ {fare ? fare.car: '-- --'}</p>
                    </div>
                    <button 
                      className='btn-1'
                      onClick={requestRideHandler}
                    >
                      Request Ride
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className='google-map border'>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map 
                  mapId={import.meta.env.VITE_MAP_ID}
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
                  // gestureHandling={'greedy'}
                >
                  <AdvancedMarker position={center}>
                    <img src='/pin.png' width={32} height={32}/>
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            </div>
            <div className='view-on-mobile mt-5'>
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
              <button 
                className='btn-1'
                onClick={requestRideHandler}
              >
                Request Ride
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home