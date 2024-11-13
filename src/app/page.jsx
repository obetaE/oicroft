import ProductForm from "@/components/ProductForm/ProductForm";
import React from "react";
import styles from "./home.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import ComboSlider from "@/components/comboslider/ComboSlider";
import Meals from "@/components/meals/Meals";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section Begins */}
      <div className={styles.HeroSection}>
        <div className={styles.herobackground}>
          <div className={styles.overlay}>
            <Image
              width={800}
              height={800}
              src="/overlay.png"
              alt="overlay"
              className={styles.overlayimg}
            />
          </div>
        </div>
      </div>
      {/* Hero Section Ends */}

      {/* Carasoul Section Begins */}
      <div className={styles.CarasoulSection}>
        <div className={styles.Carasoulbackground}>
          <div className={styles.comboDiv}>
            <div className={styles.CarasoulTitleDiv}>
              <Image
                fill
                objectFit="contain"
                src="/Product.png"
                alt="See our Products"
                className={styles.CarasoulTitle}
              />
            </div>

            <ComboSlider />
          </div>

          <div className={styles.productDiv}>
            <div className={styles.ProductTitleDiv}>
              <Image
                fill
                objectFit="contain"
                src="/And our Top Quality Goods.png"
                alt="See our Products"
                className={styles.CarasoulTitle}
              />
            </div>

            <Meals />
          </div>
        </div>
      </div>
      {/* Carasoul Section Ends */}

      {/* About Us Section Begins */}
      <div className={styles.AboutusSection}>
        <div className={styles.Aboutusbackground}> </div>
      </div>
      {/* About Us Section Ends */}
    </div>
  );
}
