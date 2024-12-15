"use client";
import React, { useState } from "react";
import styles from "./SliderForm.module.css";
import axios from "axios";

const SliderForm = () => {
  const [file, setFile] = useState(null); // Single file upload
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'
  const [isUploading, setIsUploading] = useState(false); // Button state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setAlertMessage("Please select an image.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        window.location.reload(); // Reload page after showing message
      }, 5000);
      return;
    }

    setIsUploading(true); // Disable button
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploads");

      // Upload image to Cloudinary
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dudlxsoui/image/upload",
        formData
      );

      const { url } = uploadRes.data;
      const secureUrl = url.replace("http://", "https://");

      // Send uploaded image URL to your server
      await axios.post("/api/slider", { img: secureUrl });

      setAlertMessage("Slider image added successfully!");
      setAlertType("success");
      setFile(null); // Clear file selection
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlertMessage("Failed to add slider image.");
      setAlertType("error");
    } finally {
      setTimeout(() => {
        setAlertMessage("");
        window.location.reload(); // Reload page after showing message
      }, 5000);
      setIsUploading(false); // Enable button again
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Add New Slider Image</h1>

        <div className={styles.item}>
          <label className={styles.label}>Choose an Image</label>
          <input
            className={styles.input}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className={styles.buttoncontainer}>
          <button
            type="submit"
            className={styles.submit}
            disabled={isUploading} // Disable button when uploading
          >
            {isUploading ? "Uploading..." : "Add Slider Image"}
          </button>
        </div>
        {alertMessage && (
          <div
            className={`${styles.alert} ${
              alertType === "success" ? styles.successAlert : styles.errorAlert
            }`}
          >
            {alertMessage}
          </div>
        )}
      </div>
    </form>
  );
};

export default SliderForm;
