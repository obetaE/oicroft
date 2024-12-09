"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically load the LocationPicker component to run only on the client
const LocationPicker = dynamic(() => import("./LocationPickerComponent"), {
  ssr: false,
});

export default LocationPicker;
