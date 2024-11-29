"use client";

import React, { useState } from "react";
import styles from "./UserInfo.module.css";

const UserInfo = ({ user, handleUpdate }) => {
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    number: user.number,
    password: "",
    passwordRepeat: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle editing mode
  const startEditing = (field) => {
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFormData({
      ...formData,
      password: "",
      passwordRepeat: "",
    }); // Reset password fields on cancel
  };

  // Render form dynamically
  const renderField = (field) => {
    if (editingField === field) {
      return (
        <>
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className={styles.input}
            placeholder={`Update ${field}`}
          />
          {field === "password" && (
            <input
              name="passwordRepeat"
              value={formData.passwordRepeat}
              onChange={handleChange}
              className={styles.input}
              placeholder="Repeat Password"
              type="password"
            />
          )}
          <button onClick={() => handleUpdate(formData)}>Save</button>
          <button onClick={cancelEditing}>Cancel</button>
        </>
      );
    } else {
      return (
        <>
          <span className={styles.detailValue}>{user[field]}</span>
          <button onClick={() => startEditing(field)}>Update</button>
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      {["username", "email", "number", "password"].map((field) => (
        <div key={field} className={styles.informationcontainer}>
          <div className={styles.info}>
            <span className={styles.detailTitle}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </span>
            {renderField(field)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserInfo;
