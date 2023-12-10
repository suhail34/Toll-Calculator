"use client"
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { LatLngTuple } from 'leaflet';
import RouteChannel from './RouteChannel'

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState<LatLngTuple>([0,0]);
  useEffect(()=>{
    const getUserLocation = async () => {
      if(navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          setUserLocation([position.coords.latitude, position.coords.longitude])
        } catch (error) {
            console.error(error)
          }
      }
    }
    getUserLocation();
  }, []);

  interface ChangeViewProps {
    center: LatLngTuple,
    zoom: number,
  }

  const ChangeView: React.FC<ChangeViewProps> = ({center, zoom}) => {
    const map = useMap();
    map.setView(center, zoom);
    return null
  }

  return (
    <MapContainer center={userLocation} zoom={13} className='h-96 w-2/5'>
    <ChangeView center={userLocation} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RouteChannel />
    </MapContainer>
  )
}

export default MapComponent
