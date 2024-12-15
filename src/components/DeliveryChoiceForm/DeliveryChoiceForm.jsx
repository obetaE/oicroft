import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DeliveryChoiceForm.module.css"; // Add your CSS file here

const DeliveryChoiceForm = ({ orderId, userId, onChoiceSubmit }) => {
  const [type, setType] = useState("");
  const [region, setRegion] = useState({ state: "", logistics: 0 });
  const [locations, setLocations] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error.message);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        orderId,
        userId,
        type,
        region: { state: region.state, logistics: region.logistics },
        ...(type === "Pickup" && { pickupLocation }),
        ...(type === "Delivery" && { deliveryAddress }),
      };

      await axios.post("/api/delivery-choice", payload);

      setMessage("Delivery choice saved!");
      onChoiceSubmit(); // Notify parent that delivery choice is done
    } catch (error) {
      console.error("Failed to submit delivery choice:", error.message);
      setMessage("Error saving delivery choice");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Choose Delivery Option</h2>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name="type"
            value="Pickup"
            checked={type === "Pickup"}
            onChange={(e) => setType(e.target.value)}
          />
          Pickup
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="Delivery"
            checked={type === "Delivery"}
            onChange={(e) => setType(e.target.value)}
            disabled
          />
          Delivery (Disabled)
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label>
          Region State:
          <select
            value={region.state}
            onChange={(e) => {
              const selectedRegion = locations.find(
                (loc) => loc.pickup.region.state === e.target.value
              );
              setRegion({
                state: selectedRegion.pickup.region.state,
                logistics: selectedRegion.pickup.region.logistics,
              });
            }}
            required
          >
            <option value="">Select a state</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.pickup.region.state}>
                {loc.pickup.region.state}
              </option>
            ))}
          </select>
        </label>
      </div>

      {type === "Pickup" && (
        <div className={styles.inputGroup}>
          <label>
            Pickup Location:
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            >
              <option value="">Select a pickup location</option>
              {locations
                .filter((loc) => loc.pickup.region.state === region.state)
                .map((loc) => (
                  <option key={loc._id} value={loc.pickup.location}>
                    {loc.pickup.location}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}

      {type === "Delivery" && (
        <div className={styles.inputGroup}>
          <label>
            Delivery Address:
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </label>
        </div>
      )}

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};

export default DeliveryChoiceForm;
