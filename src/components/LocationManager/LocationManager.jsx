"use client";

import { useState, useEffect } from "react";
import styles from "./LocationManager.module.css"

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
      location.reload(); // Refresh the page after saving changes
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const response = await fetch(`/api/locations?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.reload(); // Refresh the page after deleting
    }
  };

  // Toggle Disable Status
  const handleToggleDisable = async (id, section) => {
    const location = locations.find((loc) => loc._id === id);
    const isCurrentlyDisabled = location.isdisabled;

    const response = await fetch("/api/locations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        updateData: { isdisabled: !isCurrentlyDisabled },
      }),
    });

    if (response.ok) {
      window.location.reload(); // Refresh the page after toggling
    }
  };

  // Render Pickup and Delivery Sections
  const renderSection = (section, type) => {
    const filteredLocations = locations.filter((loc) => loc[section]);

    return (
      <ul>
        {filteredLocations.map((location) => (
          <li key={location._id} className={styles.list}>
            <p><b>State:</b> {location[section]?.region?.state}</p>
            <p><b>Logistics:</b> {location[section]?.region?.logistics}</p>
            {section === "pickup" && (
              <p><b>Location:</b> {location.pickup?.location}</p>
            )}
            {section === "delivery" && (
              <>
                <p><b>Zone:</b> {location.delivery?.area?.zone}</p>
                <p><b>Cost:</b> {location.delivery?.area?.cost}</p>
              </>
            )}
            <div className={styles.buttoncontainer}>
              <button
                className={styles.button}
                onClick={() => setEditData(location)}
              >
                Edit
              </button>
              <button
                className={styles.delete}
                onClick={() => handleDelete(location._id)}
              >
                Delete
              </button>
              <button
                className={styles.toggle}
                onClick={() => handleToggleDisable(location._id, section)}
              >
                {location.isdisabled ? "Enable" : "Disable"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1 className={styles.title}>Location Manager</h1>
      <h2 className={styles.sectitle}>Pickup Locations</h2>
      {renderSection("pickup", "Pickup")}
      <h2 className={styles.sectitle}>Delivery Locations</h2>
      {renderSection("delivery", "Delivery")}

      {editData && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit(editData._id);
          }}
        >
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
                setEditData((prev) => {
                  const section = prev.pickup ? "pickup" : "delivery";
                  return {
                    ...prev,
                    [section]: {
                      ...prev[section],
                      region: {
                        ...prev[section]?.region,
                        state: e.target.value,
                      },
                    },
                  };
                })
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
                setEditData((prev) => {
                  const section = prev.pickup ? "pickup" : "delivery";
                  return {
                    ...prev,
                    [section]: {
                      ...prev[section],
                      region: {
                        ...prev[section]?.region,
                        logistics: e.target.value,
                      },
                    },
                  };
                })
              }
            />
          </label>
          {editData.pickup && (
            <label>
              Location:
              <input
                type="text"
                value={editData.pickup.location || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    pickup: {
                      ...prev.pickup,
                      location: e.target.value,
                    },
                  }))
                }
              />
            </label>
          )}
          {editData.delivery && (
            <>
              <label>
                Zone:
                <input
                  type="text"
                  value={editData.delivery.area?.zone || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      delivery: {
                        ...prev.delivery,
                        area: {
                          ...prev.delivery?.area,
                          zone: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </label>
              <label>
                Cost:
                <input
                  type="number"
                  value={editData.delivery.area?.cost || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      delivery: {
                        ...prev.delivery,
                        area: {
                          ...prev.delivery?.area,
                          cost: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </label>
            </>
          )}
          <button className={styles.button} type="submit">Save</button>
          <button className={styles.delete} type="button" onClick={() => setEditData(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
