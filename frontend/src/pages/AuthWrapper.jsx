
const AuthWrapper = ({children}) => {
  return (
    <main>
    <div className='auth-container'>
      <div className='logo-img'>
        RideBook
      </div>
      <div className='auth-content'>
        {children}
      </div>
      <div className='auth-hero'>
        <img src='./hero-image.jpg'/>
      </div>
    </div>
  </main>
  )
}

export default AuthWrapper