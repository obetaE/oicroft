"use client";
import React, { useState } from "react";
import styles from "./SupportForm.module.css";

import { addSupport } from "@/libs/Action/action"; // Ensure this path matches your project structure.

export default function SupportForm() {

  return (
    <div className={styles.container}>
        <h2>Add A New Support Question and Its Answer</h2>
      <form action={addSupport} className={styles.supportForm}>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="title">
            The Question:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            placeholder="Enter Question"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="desc">
            Its Answer:
          </label>
          <textarea
            id="desc"
            name="desc"
            className={styles.textarea}
            placeholder="Enter description"
          />
        </div>

        <button className={styles.submitButton}>
          Click to Upload
        </button>

      </form>
    </div>
  );
}
