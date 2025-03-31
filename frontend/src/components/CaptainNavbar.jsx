import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTaxi } from '@fortawesome/free-solid-svg-icons'

const CaptainNavbar = () => {
  const [status, setStatus] = useState(false);

  return (
    <nav className=' shadow-md'>
      <div className='container navbar'>
        <div className='logo-img'>
          <Link to='/'>
            <span>RideApp</span>
            <FontAwesomeIcon 
              icon={faTaxi} 
              className='pl-2 fa-xl'
            />
          </Link>
        </div>
        <div className='flex items-center'>
          <div className='flex mr-2'>
            <span className='mr-2 text-lg font-semibold'>Status: </span>
            <div 
              className={`w-[55px] h-[28px] mr-4 flex items-center border-2  rounded-2xl ${status ? 'bg-amber-300 border-amber-300 justify-end' : 'bg-gray-300 border-gray-300' }`}
              onClick={()=>{setStatus(curr => !curr)}}
            >
              <div className='w-[26px] h-[26px] bg-white rounded-full'></div>
            </div>
          </div>

          <Link>
            <FontAwesomeIcon className='border-2 rounded-full p-1' icon={faUser} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default CaptainNavbar