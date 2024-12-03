"use client";
import React, { useEffect, useState } from "react";
import styles from "./ComboSlider.module.css";
import Image from "next/image";

const ComboSlider = () => {
  const [index, setIndex] = useState(0);

  const images = [
    { id: 1, image: "/Combo design .png" },
    { id: 2, image: "/Slider2.png" },
    { id: 3, image: "/Slider3.png" },
    { id: 4, image: "/Slider4.png" },
    { id: 5, image: "/Slider5.png" },
  ];

  // Automatically move to the next slide every 2 seconds
  useEffect(() => {
  const interval = setInterval(() => {
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // Pause for 1 second before moving to the next slide
  }, 3000); // Change slide every 3 seconds

  return () => clearInterval(interval);
}, []);

  // Handle manual navigation
  const handleArrow = (direction) => {
    if (direction === "l") {
      setIndex(index !== 0 ? index - 1 : images.length - 1);
    }
    if (direction === "r") {
      setIndex((index + 1) % images.length);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left arrow */}
      <div
        className={styles.arrowContainer}
        style={{ left: 0 }}
        onClick={() => handleArrow("l")}
      >
        <Image src="/wright.png" alt="arrow button" fill objectFit="contain" />
      </div>

      {/* Wrapper for images */}
      <div
        className={styles.wrapper}
        style={{ transform: `translateX(${-100 * index}vw)` }}
      >
        {images.map((img, i) => (
          <div className={styles.imgContainer} key={img.id}>
            <Image
              src={img.image}
              alt="Slider image"
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
        <Image src="/wleft.png" alt="arrow button" fill objectFit="contain" />
      </div>
    </div>
  );
};

export default ComboSlider;
