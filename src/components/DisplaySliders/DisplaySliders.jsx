"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DisplaySliders.module.css";
import Image from "next/image";
import PageLoader from "@/components/PageLoader/PageLoader";

const DisplaySliders = () => {
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'
  const [isDeleting, setIsDeleting] = useState(null); // Slider ID being deleted
  const [editingSliderId, setEditingSliderId] = useState(null); // Slider ID being edited
  const [newFile, setNewFile] = useState(null); // New file for editing

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get("/api/slider");
        setSliders(response.data);
      } catch (err) {
        console.error("Error fetching sliders:", err);
        setAlertMessage("Failed to fetch sliders.");
        setAlertType("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await axios.delete(`/api/slider/${id}`);
      setSliders(sliders.filter((slider) => slider._id !== id));
      setAlertMessage("Slider deleted successfully!");
      setAlertType("success");
    } catch (err) {
      console.error("Error deleting slider:", err);
      setAlertMessage("Failed to delete slider.");
      setAlertType("error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = async (id) => {
    if (!newFile) {
      setAlertMessage("Please select a new image to upload.");
      setAlertType("error");
      return;
    }

    setEditingSliderId(id);
    try {
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("upload_preset", "uploads");

      // Upload new image to Cloudinary
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dudlxsoui/image/upload",
        formData
      );

      const { url } = uploadRes.data;
      const secureUrl = url.replace("http://", "https://");

      // Update the slider with the new image
      const response = await axios.put(`/api/slider/${id}`, { img: secureUrl });
      setSliders(
        sliders.map((slider) =>
          slider._id === id ? { ...slider, img: response.data.img } : slider
        )
      );
      setAlertMessage("Slider updated successfully!");
      setAlertType("success");
      setNewFile(null); // Clear file selection
    } catch (err) {
      console.error("Error updating slider:", err);
      setAlertMessage("Failed to update slider.");
      setAlertType("error");
    } finally {
      setEditingSliderId(null);
    }
  };

  if (isLoading) {
    return (<PageLoader/>)
  }

  return (
    <div className={styles.container}>
      <h1>Uploaded Sliders</h1>

      {alertMessage && (
        <div
          className={`${styles.alert} ${
            alertType === "success" ? styles.successAlert : styles.errorAlert
          }`}
        >
          {alertMessage}
        </div>
      )}

      {sliders.length === 0 ? (
        <p>No sliders found.</p>
      ) : (
        <div className={styles.grid}>
          {sliders.map((slider) => (
            <div key={slider._id} className={styles.slider}>
              <Image
                src={slider.img || "/fallback-image.jpg"}
                alt="Slider"
                className={styles.image}
                width={500}
                height={300}
              />
              <div className={styles.actions}>
                {editingSliderId === slider._id ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) => setNewFile(e.target.files[0])}
                      className={styles.fileInput}
                    />
                    <button
                      className={styles.save}
                      onClick={() => handleEdit(slider._id)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.edit}
                      onClick={() => setEditingSliderId(slider._id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() =>
                        confirm(
                          "Are you sure you want to delete this slider?"
                        ) && handleDelete(slider._id)
                      }
                      disabled={isDeleting === slider._id}
                    >
                      {isDeleting === slider._id ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplaySliders;
