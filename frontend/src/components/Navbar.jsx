import { Link } from 'react-router-dom'

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
            <img className='w-[30px]' src='https://sudoku-master.vercel.app/Avatar_01.png'/>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar