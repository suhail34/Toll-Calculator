"use client"
import { createAction } from '@reduxjs/toolkit';
import { LatLng, LatLngExpression, LatLngTuple } from 'leaflet';

export const setFromPosition = createAction<LatLngExpression | null>('setFromPosition');
export const setToPosition = createAction<LatLngExpression | null>('setToPosition');
export const setFromLocationName = createAction<string | undefined>('setFromLocation');
export const setToLocationName = createAction<string | undefined>('setToLocation');
export const setRouteWayPoints = createAction<(number[] | LatLng | LatLngTuple)[]>('setRouteWayPoints'); 

