"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = () => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} />;
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearchSelect = (lat, lon) => {
    setPosition([lat, lon]);
    setSearchResults([]); // Clear search results
  };

  const saveLocation = async () => {
    const [lat, lng] = position;
    const locationData = {
      title: searchQuery || "Unnamed Location",
      description: "Selected from map",
      latitude: lat,
      longitude: lng,
    };

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationData),
      });

      if (response.ok) {
        alert("Location saved successfully!");
      } else {
        alert("Failed to save location.");
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  return (
    <div>
      <h1>Location Picker</h1>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handleSearchSelect(result.lat, result.lon)}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker />
      </MapContainer>

      <button onClick={saveLocation}>Save Location</button>
    </div>
  );
};

export default LocationPicker;
