import React from "react";
import styles from "./profile.module.css";
import UserInfo from "@/components/UserInfo/UserInfo";
import { getUser } from "@/libs/Action/data";

//2:33:28

export default async function profile({ params }) {
  const { id } = await params;
  const user = await getUser(id);
  return (
    <div className={styles.container}>
      <h1>Profile Information</h1>
      <UserInfo user={user} />
    </div>
  );
}
