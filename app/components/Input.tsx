"use client"
import { RootState } from "../redux/store";
import { setFromLocationName, setToLocationName } from "../redux/actions";
import { ConnectedProps, connect } from "react-redux";
import { encode } from '@googlemaps/polyline-codec';
import { useState } from "react";
import * as dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from "axios";
import { LatLng, LatLngTuple } from "leaflet";

dotenv.config();

const mapStateToProps = (state: RootState) => ({
  fromLocationName: state.fromLocationName,
  toLocationName: state.toLocationName,
  routeWayPoints: state.routeWayPoints,
})

const mapDispatchToProps = {
  setFromLocationName,
  setToLocationName,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;


const Input: React.FC<PropsFromRedux> = ({ fromLocationName, toLocationName, routeWayPoints }) => {
  const [respData, setRespData] = useState<any>();
  const [formData, setFormData] = useState({
    mapProvider: 'here',
    polyline: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (routeWayPoints) {
      const encodeData = encode(routeWayPoints as any);
      setFormData((prevData) => ({
        ...prevData,
        polyline: encodeData,
      }));
      console.log(encodeData);
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key' : process.env.NEXT_PUBLIC_API_KEY || '',
      }
      const Config: RequestInit = {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(formData)
      }
      try {
        const resp = await fetch("https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service", Config);
        if(!resp.ok) {
            throw new Error(`HTTP error! Status : ${resp.status}`);
        }
        const respData = await resp.json();
        setRespData(respData);
        console.log('Response : ', respData);
      } catch(err) {
        console.error('Error : ',err);
      }
    } else {
      console.error("Route waypoints are null");
    }
    console.log(formData);
  }

  return (
    <div className="flex flex-col items-center md:w-2/4 w-full">
      <form onSubmit={handleSubmit} >
        <input type="text" name="from" placeholder="From" value={fromLocationName} className="w-full bg-transparent border-b-2 placeholder-white outline-none text-white" />
        <input type="text" name="to" placeholder="To" value={toLocationName} className="w-full bg-transparent border-b-2 placeholder-white outline-none text-white" />
        <button type="submit"> Submit </button>
        <pre>{routeWayPoints?.length}</pre>
      </form>
      <div>{respData}</div>
    </div>
  )
}

export default connector(Input)
