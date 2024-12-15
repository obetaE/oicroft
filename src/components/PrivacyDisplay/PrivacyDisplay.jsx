"use client";

import React, { useEffect, useState } from "react";
import styles from "./PrivacyDisplay.module.css"
import PageLoader from "@/components/PageLoader/PageLoader";

const PrivacyDisplay = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch("/api/privacydisplay", {
          next: { revalidate: 3600 },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Privacy Policy.");
        }
        const data = await response.json();
        setContent(data.content);
        sessionStorage.removeItem("reloadCount"); // Clear reload count on success
      } catch (err) {
       const reloadCount = sessionStorage.getItem("reloadCount") || 0;
       if (reloadCount < 5) {
         sessionStorage.setItem("reloadCount", Number(reloadCount) + 1);
         window.location.reload();
       } else {
         setError("Something went wrong. Please try again later.");
       }
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return  (
      <PageLoader/>
    ); // Show loading state
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
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

export default PrivacyDisplay;
