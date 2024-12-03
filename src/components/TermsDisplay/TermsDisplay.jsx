"use client";

import React, { useEffect, useState } from "react";
import styles from "./TermsDisplay.module.css"

const TermsDisplay = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch("/api/tocdisplay");
        if (!response.ok) {
          throw new Error("Failed to fetch terms and conditions.");
        }
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return  (
      <div className="load-btn-container">
        <div className="loading-button"></div>
        <div className="loading-button"></div>
        <div className="loading-button"></div>
        <div className="loading-button"></div>
        <div className="loading-button"></div>
      </div>
    ); // Show loading state
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          background: "#f9f9f9",
        }}
      ></div>
    </div>
  );
};

export default TermsDisplay;
