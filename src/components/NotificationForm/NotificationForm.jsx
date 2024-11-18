"use client";
import React, { useState } from "react";
import styles from "./NotificationForm.module.css";

import { addNotification } from "@/libs/Action/action"; // Ensure this path matches your project structure.

export default function NotificationForm() {

  return (
    <div className={styles.container}>
        <h2>Add A New Notification</h2>
      <form action={addNotification} className={styles.notificationForm}>

        <div className={styles.inputGroup}>
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

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="desc">
            Description:
          </label>
          <textarea
            id="desc"
            name="desc"
            className={styles.textarea}
            placeholder="Enter description"
          />
        </div>

        <button className={styles.submitButton}>
          Add Notification
        </button>

      </form>
    </div>
  );
}
