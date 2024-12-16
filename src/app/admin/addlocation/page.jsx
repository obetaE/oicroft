import React from "react"
import Navbar from "@/components/Navbar/Navbar"
import LocationForm from "@/components/LocationForm/LocationForm"
import LocationManager from "@/components/LocationManager/LocationManager"
import styles from "../admin.module.css";

export default function addlocation(){
    return (
      <div>
        <div className={styles.Adminusercontainer}>
          <div className={styles.adminbg}>
              <Navbar />
            <div className={styles.usersection}>
              <h1 className={styles.userTitle}>Manage Locations</h1>
              <div className={styles.row}>
                <div className={styles.col}>
                  <LocationManager />
                </div>
                <div className={styles.col}>
                  <LocationForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}