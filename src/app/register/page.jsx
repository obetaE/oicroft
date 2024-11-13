import React from "react";
import styles from "./register.module.css";
import Navbar from "@/components/Navbar/Navbar";
import RegisterForm from "@/components/registerForm/RegisterForm";

const page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.registerbg}>
        <Navbar />

        <div className={styles.registersection}>
          <RegisterForm/>
        </div>
      </div>
    </div>
  );
};

export default page;
