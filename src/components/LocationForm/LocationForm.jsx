"use client";

import { useState } from "react";

export default function LocationForm() {
  const [formData, setFormData] = useState({
    option: "Pickup", // Default to Pickup
    state: "",
    logistics: "",
    location: "",
    zone: "",
    cost: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Prepare the data structure to match the schema
    const payload =
      formData.option === "Pickup"
        ? {
            pickup: {
              region: {
                state: formData.state,
                logistics: Number(formData.logistics),
              },
              location: formData.location,
            },
          }
        : {
            delivery: {
              region: {
                state: formData.state,
                logistics: Number(formData.logistics),
              },
              area: {
                zone: formData.zone,
                cost: Number(formData.cost),
              },
            },
          };

    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Location saved successfully!");
        setFormData({
          option: "Pickup",
          state: "",
          logistics: "",
          location: "",
          zone: "",
          cost: "",
        });
      } else {
        setMessage(`Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      window.location.reload(); // Refresh the page after toggling
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="option" className="block text-sm font-medium">
          Option
        </label>
        <select
          id="option"
          name="option"
          value={formData.option}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="Pickup">Pickup</option>
          <option value="Delivery">Delivery</option>
        </select>
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium">
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="logistics" className="block text-sm font-medium">
          Logistics Cost
        </label>
        <input
          type="number"
          id="logistics"
          name="logistics"
          value={formData.logistics}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {formData.option === "Pickup" && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Pickup Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )}

      {formData.option === "Delivery" && (
        <>
          <div>
            <label htmlFor="zone" className="block text-sm font-medium">
              Delivery Zone
            </label>
            <input
              type="text"
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium">
              Delivery Cost
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
      >
        {isSubmitting ? "Saving..." : "Save Location"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
