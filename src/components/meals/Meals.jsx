"use client"
import React from 'react'
import styles from "./meals.module.css"
import Image from 'next/image'
import { featuredProducts } from '@/temp'
import { useRouter } from 'next/navigation'

const Meals = () => {

    const router = useRouter();
    const moveToOrderPage = () => {
        router.push("/order")
    }

  return (
    <div className={styles.container} >
        <div className={styles.wrapper} >
           { 
            featuredProducts.map(item=>(

                <div key={item.id} className={styles.item} >
                { item.img && <div className={styles.imageContainer} >
                    <Image src={item.img} alt='Image of our Product' objectFit="contain"  fill />
                </div>}
                <div className={styles.textContainer} >
                    <h1>{item.title}</h1>
                    <p>{item.desc}</p>
                    <button onClick={moveToOrderPage} >See More</button>
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default Meals