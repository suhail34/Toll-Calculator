"use client"
import axios from "axios";
import { Marker, Popup } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L, { Icon } from 'leaflet';
import { setFromPosition, setToPosition, setFromLocationName, setToLocationName, setRouteWayPoints } from '../redux/actions';
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "../redux/store";
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'

const mapStateToProps = (state: RootState) => ({
  fromPostion: state.fromPosition,
  toPosition: state.toPosition,
  fromLocationName: state.fromLocationName,
  toLocationName: state.toLocationName,
})

const mapDispatchToProps = {
  setFromPosition,
  setToPosition,
  setFromLocationName,
  setToLocationName,
  setRouteWayPoints
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>; 

const RouteChannel: React.FC<PropsFromRedux> = ({fromPostion, toPosition, setFromPosition, setToPosition, fromLocationName, toLocationName, setFromLocationName, setToLocationName, setRouteWayPoints}) => {
  const [markers, setMarkers] = useState<{ fromMarker: L.Marker | null, toMarker: L.Marker | null }>({ fromMarker: null, toMarker: null });
  const map = useMap();
  const routeControlRef = useRef<L.Routing.Control>();

  const clearRoute = () => {
    if(routeControlRef.current) {
      map.removeControl(routeControlRef.current);
    }
  }

  const handleMapClick = async(e: L.LeafletMouseEvent) => {
    const {lat, lng} = e.latlng;
    if (fromPostion && toPosition){
      setFromPosition(null);
      setToPosition(null);
      setFromLocationName(undefined);
      setToLocationName(undefined);
      clearRoute();
    } else if(!fromPostion) {
      setFromPosition([lat, lng]);
      const fromLocation = await getLocationName(lat, lng);
      setFromLocationName(fromLocation)
    } else if(!toPosition) {
      setToPosition([lat, lng]);
      const toLocation = await getLocationName(lat, lng);
      setToLocationName(toLocation)
    }
  }

  const getLocationName = async (lat:number, lng:number): Promise<string> => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.data;
      const displayName = data.display_name || 'Unnamed Location';
      return displayName;
    } catch(error) {
      console.error("Error fetching location : ", error);
      return 'Unnamed Location';
    }
  }
  const customIcon = new Icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
  useMapEvents({
    click(e) {
      handleMapClick(e)
    }
  })
  const updateLocationNameOnDrag = (marker: L.Marker, locationSetter: ActionCreatorWithOptionalPayload<string|undefined, string>) => {
    marker.on('dragend', async (e: L.LeafletEvent) => {
      const { lat, lng } = e.target.getLatLng();
      const locationName = await getLocationName(lat, lng);
      locationSetter(locationName)
    })
  }
  const draw = () => {
    if (fromPostion && toPosition) {
      const fromMarker = markers.fromMarker?markers.fromMarker.setLatLng(fromPostion):L.marker(fromPostion, {icon: customIcon, draggable: true}).addTo(map);
      const toMarker = markers.toMarker?markers.toMarker.setLatLng(toPosition):L.marker(toPosition, {icon: customIcon, draggable: true}).addTo(map);
      setMarkers({fromMarker, toMarker});
      updateLocationNameOnDrag(fromMarker, setFromLocationName);
      updateLocationNameOnDrag(toMarker, setToLocationName);
      const waypoints = [L.latLng(fromPostion), L.latLng(toPosition)];
      clearRoute();
      routeControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging:true,
      });
      routeControlRef.current.addTo(map).on('routesfound', function(e) {
          const route = e.routes[0];
          const waypointsRoute = route.coordinates
          setRouteWayPoints(waypointsRoute);
      });
      console.log("location : ", fromLocationName, toLocationName)
    }
  }
  useEffect(()=>{
    draw();
  }, [fromPostion, toPosition, map])

  return (
    <div>
      {fromPostion && ( 
        <Marker icon={customIcon} draggable={true} position={fromPostion} >
          <Popup>{fromLocationName}</Popup>
        </Marker>
      )}
      {toPosition && (
        <Marker icon={customIcon} draggable={true} position={toPosition} >
          <Popup>{toLocationName}</Popup>
        </Marker>
      )}
    </div>
  )
}

export default connector(RouteChannel);
