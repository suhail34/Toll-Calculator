// reducers.ts
"use client"
import { LatLng, LatLngExpression, LatLngTuple } from 'leaflet';
import { setFromPosition, setToPosition, setFromLocationName, setToLocationName, setRouteWayPoints } from './actions';
import { createReducer } from '@reduxjs/toolkit';

interface RootState {
  fromPosition: LatLngExpression | null;
  toPosition: LatLngExpression | null;
  fromLocationName: string | undefined;
  toLocationName: string | undefined;
  routeWayPoints: (number[] | LatLng | LatLngTuple)[];
  // other state properties
}

const initialState: RootState = {
  fromPosition: null,
  toPosition: null,
  fromLocationName: undefined,
  toLocationName: undefined,
  routeWayPoints: [],
  // other initial state properties
};

const rootReducer = createReducer(initialState, (builder) => {
  builder.addCase(setFromPosition, (state, action) => {
    state.fromPosition = action.payload;
  });

  builder.addCase(setToPosition, (state, action) => {
    state.toPosition = action.payload;
  });
  
  builder.addCase(setFromLocationName, (state, action) => {
    state.fromLocationName = action.payload;
  });

  builder.addCase(setToLocationName, (state, action) => {
    state.toLocationName = action.payload;
  });

  builder.addCase(setRouteWayPoints, (state, action) => {
    state.routeWayPoints = action.payload;
  })

  // other reducer cases
});
export default rootReducer;

