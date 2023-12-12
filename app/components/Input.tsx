"use client"
import { RootState } from "../redux/store";
import { setFromLocationName, setToLocationName } from "../redux/actions";
import { ConnectedProps, connect } from "react-redux";
import { encode } from '@googlemaps/polyline-codec';
import { useState } from "react";
import * as dotenv from 'dotenv';

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
  const [respData, setRespData] = useState<any>(null);
  const [formData, setFormData] = useState({
    mapProvider: 'here',
    polyline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (routeWayPoints) {
      const encodeData = encode(routeWayPoints as any);
      setFormData((prevData) => ({
        ...prevData,
        polyline: encodeData,
      }));
      fetch("https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service", {
        method: 'post',
        headers : {
          'Content-Type': 'application/json',
          'X-Api-Key': 'T6b28rhHdF3j3N2fqntTRpJ3Mt38bbQL',
        },
        body: JSON.stringify(formData)
      }).then(response => response.json())
      .then(data => {
        console.log(data);
        setRespData(data);
      })
      .catch(error => console.error('Error : ', error));
    } else {
      console.error("Route waypoints are null");
    }
  }

  return (
    <div className="flex flex-col items-center md:w-2/4 w-full">
      <form onSubmit={handleSubmit} >
        <input type="text" name="from" placeholder="From" value={fromLocationName} className="w-full bg-transparent border-b-2 placeholder-white outline-none text-white" />
        <input type="text" name="to" placeholder="To" value={toLocationName} className="w-full bg-transparent border-b-2 placeholder-white outline-none text-white" />
        <button type="submit"> Submit </button>
        <pre>{routeWayPoints?.length}</pre>
      </form>
      <div>{respData!==null?"Cost "+respData['route']['costs']['fuel']+" INR":"Loading..."}</div>
    </div>
  )
}

export default connector(Input)
