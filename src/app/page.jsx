import React from "react";
import styles from "./home.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import ComboSlider from "@/components/comboslider/ComboSlider";
import Meals from "@/components/meals/Meals";
import Link from "next/link"
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  
  return (
    <div className={styles.verified}>
      {session ? (
        session.user?.isVerified && <div className="hidden"></div>
      ) : (
        <div className={styles.otp}>
          <Link href="/resendotp">Click Here to Verify Your Account</Link>
        </div>
      )}

      <div className={styles.container}>
        <Navbar />

        {/* Hero Section Begins */}
        <div className={styles.HeroSection}>
          <div className={styles.herobackground}>
            <div className={styles.overlay}>
              <div className={styles.overlayimgcontainer}>
                <Image
                  fill
                  src="/overlay.png"
                  alt="overlay"
                  className={styles.overlayimg}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Hero Section Ends */}

        {/* Carasoul Section Begins */}
        <div className={styles.CarasoulSection}>
          <div className={styles.Carasoulbackground}>
            <div className={styles.comboDiv}>
            <ComboSlider /> 
            </div>

            <div className={styles.productDiv}>
              <div className={styles.ProductTitleDiv}>
                <Image
                  fill
                  objectFit="contain"
                  src="https://res.cloudinary.com/dudlxsoui/image/upload/v1734233083/And_our_Top_Quality_Goods_jtwhrq.png"
                  alt="Products"
                  className={styles.CarasoulTitle}
                />
              </div>

              <Meals />
            </div>
          </div>
        </div>
        {/* Carasoul Section Ends */}

        {/* About Us Section Begins
        <div className={styles.AboutusSection}>
          <div className={styles.Aboutusbackground}> </div>
        </div> 
         About Us Section Ends */}
      </div>
    </div>
  );
}
