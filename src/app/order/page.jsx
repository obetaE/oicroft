import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./menu.module.css"
import Secondnav from "@/components/secondnav/Secondnav";
import MenuItems from "@/components/MenuItems/MenuItems";
import MenuSlider from "@/components/MenuSlider/MenuSlider";

export default async function order() {
  const session = await auth();
  if (!session) return redirect("/login");

  return (
    <>
      <Secondnav />
      <div className={styles.container}>
        <div className={styles.cartbg}>
            <MenuSlider />
            <div className={styles.backdrop} >
          <div className={styles.section}>
            <MenuItems />
          </div>
            </div>
        </div>
      </div>
    </>
  );
}
