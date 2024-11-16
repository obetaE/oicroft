import React from 'react'
import styles from "./UserInfo.module.css"

const UserInfo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.informationcontainer} >
        <span className={styles.detailTitle} >UserName:</span>
        <span className={styles.detailValue} >The Developer</span>
      </div>
      <div>
        <span>Image:</span>
        <span>The Developer</span>
      </div>
      <div className={styles.informationcontainer} >
        <span className={styles.detailTitle} >Email:</span>
        <span className={styles.detailValue} >Ericobeta14@gmail.com</span>
      </div>
      <div className={styles.informationcontainer} >
        <span className={styles.detailTitle} >Phone Number:</span>
        <span className={styles.detailValue} >+2348051025661</span>
      </div>
      <div className={styles.informationcontainer} >
        <span className={styles.detailTitle} >Password</span>
        <span className={styles.detailValue} >########</span>
      </div>
    </div>
  );
}

export default UserInfo