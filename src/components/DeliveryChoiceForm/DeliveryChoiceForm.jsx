import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DeliveryChoiceForm.module.css"; // Add your CSS file here

const DeliveryChoiceForm = ({ orderId, userId, onChoiceSubmit }) => {
  const [type, setType] = useState("");
  const [locationId, setLocationId] = useState(""); // For storing the selected location's ID
  const [locations, setLocations] = useState([]); // Store all locations fetched from the API
  const [deliveryAddress, setDeliveryAddress] = useState(""); // Address for delivery option
  const [message, setMessage] = useState("");

  // Fetch available locations on component mount
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
        locationId, // Selected location ID
        option: type, // Pickup or Delivery
        ...(type === "Delivery" && { deliveryAddress }), // Add delivery address if it's a delivery
      };

      await axios.post("/api/delivery", payload);

      setMessage("Delivery choice saved!");
      onChoiceSubmit(); // Notify parent component that the choice was submitted
    } catch (error) {
      console.error("Failed to submit delivery choice:", error.message);
      setMessage("Error saving delivery choice");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Choose Delivery Option</h2>

      <div className={styles.radioGroup}>
        <label className={styles.radioLabel}>
          <input
            className={styles.radioInput}
            type="radio"
            name="type"
            value="Pickup"
            checked={type === "Pickup"}
            onChange={(e) => setType(e.target.value)}
          />
          Pickup
        </label>
        <label className={styles.radioLabel}>
          <input
            className={styles.radioInput}
            type="radio"
            name="type"
            value="Delivery"
            checked={type === "Delivery"}
            onChange={(e) => setType(e.target.value)}
          />
          Delivery
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          Select Region/Location:
          {locations.length === 0 ? ( // Check if no locations are available
            <p className={styles.noLocations}>
              Locations are not available at the moment
            </p>
          ) : (
            <select
              className={styles.select}
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              required
            >
              <option className={styles.option} value="">
                Select a location
              </option>
              {locations.map((loc) => (
                <option className={styles.option} key={loc._id} value={loc._id}>
                  {loc.pickup?.region?.state || loc.delivery?.region?.state} -{" "}
                  {loc.pickup?.location || loc.delivery?.area?.zone || "N/A"}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      {type === "Delivery" && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Delivery Address:
            <input
              className={styles.textInput}
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
