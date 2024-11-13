import React from "react";
import styles from "./MenuItems.module.css"
import Image from "next/image";
import { featuredProducts } from "@/temp";

export default function MenuItems(){
    return(
       <div className={styles.wrapper}>
         {featuredProducts.map((item) => (
           <div key={item.id} className={styles.item}>
             {item.img && (
               <div className={styles.imageContainer}>
                 <Image
                   src={item.img}
                   alt="Image of our Product"
                   objectFit="contain"
                   fill
                 />
               </div>
             )}
             <div className={styles.textContainer}>
               <h1>{item.title}</h1>
               <p>{item.desc}</p>
               <span>{item.price}</span>
               <button>Add to Cart</button>
             </div>
           </div>
         ))}
       </div>
    )
};