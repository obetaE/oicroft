import React from "react"
import styles from "./product.module.css";
import SliderForm from "@/components/SliderForm/SliderForm"
import Navbar from "@/components/Navbar/Navbar";
import DisplaySliders from "@/components/DisplaySliders/DisplaySliders";

export default function animalPage(){
  return(
     <div className={styles.container}>
      <div className={styles.adminbg}>
        <Navbar/>
        <div className={styles.section}>
         <SliderForm/>
         <DisplaySliders/>
        </div>
      </div>
    </div>
  )
}