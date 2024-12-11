import React from "react"
import styles from "./product.module.css";
import ProductTable from "@/components/ProductTable/ProductTable"
import Navbar from "@/components/Navbar/Navbar";

export default function animalPage(){
  return(
     <div className={styles.container}>
      <div className={styles.adminbg}>
        <Navbar/>
        <div className={styles.section}>
         <ProductTable/>
        </div>
      </div>
    </div>
  )
}