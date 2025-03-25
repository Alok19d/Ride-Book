import { useState } from 'react'
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faLocationDot } from '@fortawesome/free-solid-svg-icons'


const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setSestination] = useState('');

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
                      placeholder='Pickup Location'
                      required
                    />
                    <FontAwesomeIcon icon={faCircle} />
                  </div>
                  <div className='input-box landing-inp'>
                    <label>
                      Destination
                    </label>
                    <input 
                      type='text' 
                      placeholder='Destination Location'
                      required
                    />
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  
                  {/* Choose Vehicle Type */}
                  <div className='hide-on-mobile space-y-3'>
                    <h2 className='text-lg font-semibold'>Choose Ride Type</h2>
                    <div className='flex justify-between items-center px-4 py-2 border rounded'>
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
                      <p className='font-semibold'>₹ 25.56</p>
                    </div>
                    <div className='flex justify-between items-center px-4 py-2 border rounded'>
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
                      <p className='font-semibold'>₹ 20.56</p>
                    </div>
                    <div className='flex justify-between items-center px-4 py-2 border rounded'>
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
                      <p className='font-semibold'>₹ 35.56</p>
                    </div>
                    <button className='btn-1'>Request Ride</button>
                  </div>
                </form>
              </div>
            </div>
            <div className='google-map border'>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map 
                  zoom={12} 
                  center={{lat: 28.6139, lng: 77.2088}}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                  }}
                  gestureHandling={'greedy'}
                >
                {/* <AdvancedMarker position={{lat: 29.5, lng: -81.2}} /> */}
                </Map>
              </APIProvider>
            </div>
            <div className='view-on-mobile mt-5'>
              <h2 className='text-lg font-semibold mb-1'>Choose Ride Type</h2>
              <div className='flex justify-between mb-3'>
                <div className='flex flex-col items-center border px-5 py-1 rounded-lg'>
                  <img 
                    src='/auto.png'
                    className='w-12'
                  />
                  <p>Auto</p>
                </div>
                <div className='flex flex-col items-center border px-5 py-1 rounded-lg'>
                  <img 
                    src='/motorcycle.png'
                    className='w-12'
                  />
                  <p>Motorcycle</p>
                </div>
                <div className='flex flex-col items-center border px-5 py-1 rounded-lg'>
                  <img 
                    src='/car.png'
                    className='w-12'
                  />
                  <p>Car</p>
                </div>
              </div>
              <button className='btn-1'>Request Ride</button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home