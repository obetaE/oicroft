import React from 'react'
import styles from "./admin.module.css"
import Navbar from "@/components/Navbar/Navbar";
import NotificationForm from "@/components/NotificationForm/NotificationForm";

const adminpage = () => {
  return (
    <div className={styles.container} >
      <Navbar/>
      Admin Page
      <NotificationForm/>
    </div>
  )
}

export default adminpage