import React from 'react'
import Image from 'next/image';
import styles from "./PageLoader.module.css" 

const PageLoader = () => { 
  return (
    <div className={styles.container} > 
      
      <div className={styles.imgcontainer} > 
        <Image src="/Website page.png" alt='loading image' width={200} height={200} />
      </div>

    </div>
  )
}

export default PageLoader

