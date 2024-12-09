import React from "react"
import styles from "@/app/admin/admin.module.css"
import ProductForm from "@/components/ProductForm/ProductForm"

export default function addProduct(){
    return(
        <div className={styles.container}>
            <div className={styles.adminbg}>
                <div className={styles.section}>
                    <ProductForm/>
                </div>
            </div>
        </div>
    )
}