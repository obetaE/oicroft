"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./ComboSlider.module.css";
import PageLoader from "@/components/PageLoader/PageLoader";

const ComboSlider = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch slider images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/slider");
        setImages(response.data); // Extract image URLs
      } catch (error) {
        console.error("Error fetching slider images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Automatically move to the next slide every 3 seconds
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [images]);

  // Handle manual navigation with arrows
  const handleArrow = (direction) => {
    if (direction === "l") {
      setIndex(index !== 0 ? index - 1 : images.length - 1);
    }
    if (direction === "r") {
      setIndex((index + 1) % images.length);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (images.length === 0) {
    return <p>No images available for the slider.</p>;
  }

  return (
    <div className={styles.container}>
      {/* Left arrow */}
      <div
        className={styles.arrowContainer}
        style={{ left: 0 }}
        onClick={() => handleArrow("l")}
      >
        <Image
          src="/wright.png"
          alt="left arrow button"
          fill
          objectFit="contain"
        />
      </div>

      {/* Wrapper for images */}
      <div
        className={styles.wrapper}
        style={{ transform: `translateX(${-100 * index}vw)` }}
      >
        {images.map((image, i) => (
          <div className={styles.imgContainer} key={i}>
            <Image
              src={image.img || "/fallback-image.jpg"}
              alt={`Combo slider image ${i + 1}`}
              fill
              objectFit="contain"
            />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <div
        className={styles.arrowContainer}
        style={{ right: 0 }}
        onClick={() => handleArrow("r")}
      >
        <Image
          src="/wleft.png"
          alt="right arrow button"
          fill
          objectFit="contain"
        />
      </div>
    </div>
  );
};

export default ComboSlider;
