"use client"
import React from "react"
import { addUser } from "@/libs/Action/action";
import { useActionState } from "react";
import styles from "./AdminUserForm.module.css"

const AdminUserForm = () =>{
    const [state, formAction] = useActionState(addUser, undefined);
    return (
      <div>
        <h1>Create a User</h1>
        <form action={formAction} className={styles.registerform}>
          <h2>Create Your Account</h2>
          <div className={styles.formgroup}>
            <label htmlFor="name">UserName:</label>
            <input
              type="text"
              id="name"
              name="username"
              className={styles.name}
              required
              placeholder="Type your fullname"
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Type Your Email"
              required
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="number">Phone Number:</label>
            <input
              type="text"
              id="number"
              name="number"
              placeholder="Start with your country code(i.e +234)"
              required
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a new password"
              required
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="Confirmpassword">Confirm Password:</label>
            <input
              type="password"
              id="Confirmpassword"
              name="passwordRepeat"
              placeholder="Confirm Your Password"
              required
            />
          </div>
          <div className={styles.formgroup}>
            <select name="isAdmin">
                <option value="false" >Do you want them to be an Admin?</option>
                <option value="false" >No</option>
                <option value="true" >Yes</option>
            </select>
          </div>
          <div className={styles.formgroup}>
            <select name="isWorker">
                <option value="false" >Do you want them to be a Worker?</option>
                <option value="false" >No</option>
                <option value="true" >Yes</option>
            </select>
          </div>
          <div className={styles.formgroup}>
            <div className={styles.button}>
              {state?.error}
              <button className={styles.signup}>Create User</button>
            </div>
          </div>
        </form>
      </div>
    );
}

export default AdminUserForm