import CaptainNavbar from '../components/CaptainNavbar'
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps'

const CaptainHome = () => {
  return (
    <>
      <CaptainNavbar />
      <main className='home'>
        <section className='landing'>
          <div className='container landing-container'>
            <div className='ride-info'>
              <div className='new-ride-container h-full p-2 bg-gray-100 rounded'>
                <h2 className='text-lg font-semibold'>Availiable Rides</h2>
                
                <div className='p-2 bg-white border rounded'>
                  <div className='flex justify-between items-center '>
                    <div>
                      <p>Pickup: Bhagalpur, Bihar</p>
                      <p>Dropoff: Bihar Sharif</p>
                    </div>
                    <p className='font-semibold'>₹ 25</p>
                  </div>
                  <div className='flex justify-between mt-5'>
                    <button className='basis-[48%] py-1 bg-green-600 text-white font-semibold border rounded'>
                      Accept
                    </button>
                    
                    <button className='basis-[48%] py-1 bg-red-600 text-white font-semibold border rounded'>
                      Reject
                    </button>
                  </div>
                </div>
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
          </div>
        </section>
      </main>
    </>
  )
}

export default CaptainHome