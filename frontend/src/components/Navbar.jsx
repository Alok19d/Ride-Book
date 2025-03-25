import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <nav className=' shadow-md'>
      <div className='container navbar'>
        <div className='logo-img'>
          <Link to='/'>
            <span>RideApp</span>
          </Link>
        </div>
        <div className='nav-links hide-on-mobile'>
          <Link>Home</Link>
          <Link>Rides</Link>
          <Link>Wallets</Link>
          <Link>Refer & Earn</Link>
          <Link>Support</Link>
        </div>
        <div className='icons'>
          <Link>
            Notifications
          </Link>
          <Link>
            <FontAwesomeIcon className='border-2 rounded-full p-1' icon={faUser} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar