import React from "react"
import styles from "./product.module.css";
import AnimalTable from "@/components/AnimalTable/AnimalTable"
import ProductTable from "@/components/ProductTable/ProductTable"
import ComboTable from "@/components/ComboTable/ComboTable"
import Navbar from "@/components/Navbar/Navbar";

export default function productPage(){
  return(
     <div className={styles.container}>
      <div className={styles.adminbg}>
        <Navbar/>
        <div className={styles.section}>
         <ProductTable/>
        </div>
        <div className={styles.section}>
         <AnimalTable/>
        </div>
        <div className={styles.section}>
         <ComboTable/>
        </div>
      </div>
    </div>
  )
}