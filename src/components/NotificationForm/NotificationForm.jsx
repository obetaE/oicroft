"use client";
import React, { useState } from "react";
import styles from "./NotificationForm.module.css";

import { addNotification } from "@/libs/Action/action"; // Ensure this path matches your project structure.

export default function NotificationForm() {

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add A New Notification</h2>
      <form action={addNotification} className={styles.notificationForm}>
        <div className={styles.formgroup}>
          <label className={styles.label} htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            placeholder="Enter title"
          />
        </div>

        <div className={styles.formgroup}>
          <label className={styles.label} htmlFor="desc">
            Description:
          </label>
          <textarea
            id="desc"
            name="desc"
            className={styles.textarea}
            placeholder="Enter description"
            rows="10"
          />
        </div>

        <div className={styles.formgroup}>
          <div className={styles.button}>
            <button>Add Notification</button>
          </div>
        </div>
      </form>
    </div>
  );
}
