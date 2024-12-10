import React from "react"
import styles from "@/app/admin/admin.module.css"
import Navbar from "@/components/Navbar/Navbar";
import ProductForm from "@/components/ProductForm/ProductForm"
import AnimalForm from "@/components/AnimalForm/AnimalForm"
import ComboForm from "@/components/ComboForm/ComboForm"

export default function addProduct(){
    return(
        <div className={styles.container}>
            <div className={styles.adminbg}>
                <Navbar/>
                <div className={styles.section}>
                    <ProductForm/>
                    <AnimalForm/>
                    <ComboForm/>
                </div>
            </div>
        </div>
    )
}