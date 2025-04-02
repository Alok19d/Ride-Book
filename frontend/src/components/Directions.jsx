import {useState, useEffect} from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { pick } from 'lodash';

function Directions({pickup, destination}){
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionService, setDirectionService] = useState(null)
  const [directionRenderer, setDirectionRenderer] = useState(null)

  /* Initialize Services */
  useEffect(() => {
    if(!routesLibrary || !map) return;
    
    setDirectionService(new routesLibrary.DirectionsService());
    setDirectionRenderer(new routesLibrary.DirectionsRenderer({
      map: map,
      polylineOptions: {
        strokeColor: "#0000ff"
      }
    }));
  }, [routesLibrary, map]);

  /* Calculate and Display Route */
  useEffect(() => {
    if(!directionService || !directionRenderer || !pickup || !destination){
      return 
    }

    directionService
    .route({
      origin: pickup,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then((response) => {
      directionRenderer.setDirections(response);
    });

  },[directionService, directionRenderer, pickup, destination]);
}

export default Directions