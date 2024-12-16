import React from "react"
import styles from "../admin.module.css";
import SliderForm from "@/components/SliderForm/SliderForm"
import Navbar from "@/components/Navbar/Navbar";
import DisplaySliders from "@/components/DisplaySliders/DisplaySliders";

export default function animalPage(){
  return (
    <div>
      <div className={styles.Adminusercontainer}>
        <div className={styles.adminbg}>
            <Navbar />
          <div className={styles.usersection}>
            <h1 className={styles.userTitle}>Manage Sliders</h1>
            <div className={styles.row}>
              <div className={styles.coll}>
                <DisplaySliders />
              </div>
              <div className={styles.col}>
                <SliderForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


         