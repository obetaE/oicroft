"use client";

import { useState, useEffect } from "react";

export default function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [editData, setEditData] = useState(null);

  // Fetch locations
  useEffect(() => {
    async function fetchLocations() {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data);
    }
    fetchLocations();
  }, []);

  // Handle Edit Submission
  const handleEditSubmit = async (id) => {
    const response = await fetch("/api/locations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updateData: editData }),
    });

    if (response.ok) {
      const updatedLocation = await response.json();
      setLocations((prev) =>
        prev.map((loc) => (loc._id === id ? updatedLocation : loc))
      );
      setEditData(null); // Clear form
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const response = await fetch(`/api/locations?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    }
  };

  return (
    <div>
      <h1>Location Manager</h1>
      <ul>
        {locations.map((location) => (
          <li key={location._id}>
            <p>
              State:{" "}
              {location.pickup?.region?.state ||
                location.delivery?.region?.state}
            </p>
            <p>
              Logistics:{" "}
              {location.pickup?.region?.logistics ||
                location.delivery?.region?.logistics}
            </p>
            <p>Option: {location.pickup ? "Pickup" : "Delivery"}</p>
            <button onClick={() => setEditData(location)}>Edit</button>
            <button onClick={() => handleDelete(location._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editData && (
        <form onSubmit={() => handleEditSubmit(editData._id)}>
          <h2>Edit Location</h2>
          <label>
            State:
            <input
              type="text"
              value={
                editData.pickup?.region?.state ||
                editData.delivery?.region?.state ||
                ""
              }
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  pickup: {
                    ...prev.pickup,
                    region: { ...prev.pickup?.region, state: e.target.value },
                  },
                }))
              }
            />
          </label>
          <label>
            Logistics:
            <input
              type="number"
              value={
                editData.pickup?.region?.logistics ||
                editData.delivery?.region?.logistics ||
                ""
              }
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  pickup: {
                    ...prev.pickup,
                    region: {
                      ...prev.pickup?.region,
                      logistics: e.target.value,
                    },
                  },
                }))
              }
            />
          </label>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}
