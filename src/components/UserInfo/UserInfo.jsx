import React from "react";
import styles from "./UserInfo.module.css";
import Image from "next/image";

const UserInfo = ({ user }) => {
  return (
    <div className={styles.container}>
      <div className={styles.informationcontainer}>
        <span className={styles.detailTitle}>UserName:</span>
        <span className={styles.detailValue}>{user.username}</span>
        <button>Update</button>
      </div>
      <div>
        <span>Image:</span>
        <Image
          src={user.image || "/noAvatar.png"}
          alt="Profile Image"
          width={50}
          height={50}
        />
        <button>Update</button>
      </div>
      <div className={styles.informationcontainer}>
        <span className={styles.detailTitle}>Email:</span>
        <span className={styles.detailValue}>{user.email}</span>
        <button>Update</button>
      </div>
      <div className={styles.informationcontainer}>
        <span className={styles.detailTitle}>Phone Number:</span>
        <span className={styles.detailValue}>{user.number}</span>
        <button>Update</button>
      </div>
      <div className={styles.informationcontainer}>
        <span className={styles.detailTitle}>Password</span>
        <span className={styles.detailValue}>{user.password}</span>
        <button>Update</button>
      </div>
    </div>
  );
};

export default UserInfo;
