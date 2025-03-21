import React, { useState, useEffect } from 'react'
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle,faLocationDot } from '@fortawesome/free-solid-svg-icons'


const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setSestination] = useState('');
  

  return (
    <>
      <Navbar />  
      <main className='home'>
        <section className='landing-section'>
          <div className='container landing-container'>
            <div className='ride-details'>
              <div className='ride-form-container'>
                <form name='new-ride'>
                  <div className='input-box landing-input'>
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
                  <div className='input-box landing-input'>
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
                  <h3>Choose Ride Type</h3>
                  <div className='ride-type'>
                    <div>
                      <div className='flex flex-col'>
                        <h5>Car</h5>
                        <p>4 seats, 3 min away</p>
                      </div>
                    </div>
                    <div>
                    <p>12.5</p>
                    </div>
                  </div>
                  <button className='btn-1'>Request Ride</button>
                </form>
              </div>
            </div>
            <div className='embedded-map'>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map zoom={12} center={{lat: 28.6139, lng: 77.2088}}>
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

export default Home