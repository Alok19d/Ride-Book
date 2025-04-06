import React from 'react'
import { useNavigate ,useLocation, useSearchParams } from 'react-router-dom' 

const CaptainRide = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rideId = searchParams.get("rideId");
  const [ride, setRide] = useState(location.state?.ride);

  const [route, setRoute] = useState(null);

  const center = {lat: 28.6139, lng: 77.2088};
  const [step, setStep] = useState(1);

  return (
    <div>CaptainRide</div>
  )
}

export default CaptainRide