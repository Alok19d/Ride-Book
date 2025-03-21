import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTaxi } from '@fortawesome/free-solid-svg-icons'

const CaptainAuthWrapper = ({children}) => {
  return (
    <main>
    <div className='auth-container'>
      <div className='logo-img'>
        RideBook
        <FontAwesomeIcon 
          icon={faTaxi} 
          className='pl-2'
        />
      </div>
      <div className='auth-content'>
        {children}
      </div>
      <div className='auth-hero'>
        <img src='./hero-captain-image.jpg'/>
      </div>
    </div>
  </main>
  )
}

export default CaptainAuthWrapper