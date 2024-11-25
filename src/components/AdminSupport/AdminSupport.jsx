import React from "react";
import styles from "./AdminSupport.module.css";
import { getSupports } from "@/libs/Action/data";
import { deleteSupport } from "@/libs/Action/action";

const AdminSupport = async () => {
  const supports = await getSupports();


  return (
    <div className={styles.container} >
      <h1 className={styles.title} >Support Content</h1>
      {supports.map((support) => (
        <div className={styles.support} key={support.id}>
          <div className={styles.details}>
            <h1>{support.title}</h1>
            <p>{support.desc}</p>
          </div>
          <form action={deleteSupport} >
            <input type="hidden" name="id" value={support.id}/>
            <button className={styles.delete} >Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AdminSupport;
