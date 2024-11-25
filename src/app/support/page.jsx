import React from 'react'
import styles from "./support.module.css"
import Secondnav from "@/components/secondnav/Secondnav"
import SupportContent from '@/components/SupportContent/SupportContent'
import { getSupports } from "@/libs/Action/data";


export default async function support(){
  const supports = await getSupports();
  return(
    <div>
    <Secondnav/>
    <div className={styles.container} >
    <div className={styles.supportbg} >
      <div className={styles.section} >
        
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <SupportContent supports={supports} />
      </div>
    </div>
    </div>
    </div>
  )
}