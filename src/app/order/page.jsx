import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./menu.module.css"
import Image from "next/image"
import ProductIdNav from "@/components/ProductIdNav/ProductIdNav";
import MenuItems from "@/components/MenuItems/MenuItems";
import ComboItems from "@/components/ComboItems/ComboItems";
import AnimalItems from "@/components/AnimalItems/AnimalItems";
import MenuSlider from "@/components/MenuSlider/MenuSlider";

export default async function order() {
  const session = await auth();
  if (!session) return redirect("/login");

  return (
    <>
      <ProductIdNav />
      <div className={styles.container}>
        <div className={styles.cartbg}>
          <MenuSlider />

          <div className={styles.CarasoulTitleDiv}>
            <Image
              fill
              objectFit="contain"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733861363/Grains_and_Root_Product_hdurym.png"
              alt="See our Products"
              className={styles.CarasoulTitle}
            />
          </div>
          <div className={styles.backdrop}>
            <div className={styles.section}>
              <MenuItems />
            </div>
          </div>
          <div className={styles.CarasoulTitleDiv}>
            <Image
              fill
              objectFit="contain"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733861363/Farm_ByProduct_lxphqy.png"
              alt="See our Products"
              className={styles.CarasoulTitle}
            />
          </div>
          <div className={styles.backdrop}>
            <div className={styles.section}>
            <AnimalItems/>
            </div>
          </div>
          <div className={styles.CarasoulTitleDiv}>
            <Image
              fill
              objectFit="contain"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733861364/Oicroft_Combos_aaxtdt.png"
              alt="See our Products"
              className={styles.CarasoulTitle}
            />
          </div>
          <div className={styles.backdrop}>
            <div className={styles.section}>
              <ComboItems />
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
