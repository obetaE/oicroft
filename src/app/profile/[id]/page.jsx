import React from "react";
import styles from "./profile.module.css";
import UserInfo from "@/components/UserInfo/UserInfo";
import { getUser } from "@/libs/Action/data";
import { updateUser } from "@/libs/Action/action";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";

export default async function profile({ params }) {
  const { id } = await params;
  const user = await getUser(id); 

  // Define handleUpdate as a wrapper around updateUser
 const handleUpdate = async (formData) => {
   "use server";
   console.log("ID being passed:", user.id);
   console.log("FormData being passed:", formData);

   try {
     const updatedUser = await updateUser(user.id, formData);
     if (updatedUser.error) {
       console.log(`Error updating user: ${updatedUser.error}`);
     } else {
       console.log("User updated successfully!");
       // Trigger a page refresh
       window.location.reload(); // Refreshes the entire page
     }
   } catch (error) {
     console.error("Error during update:", error);
   }
 };



  return (
    <div className={styles.container}>
      <div className={styles.profilebg}>
        <Navbar />
        <div className={styles.section}>
          <div className={styles.header}>
            <h1>Profile Information</h1>
            <div className={styles.imgcontainer}>
              <Image
                src={user.image || "/Profile Pic.png"}
                alt="Profile Picture"
                fill
                className={styles.img}
              />
            </div>
          </div>
          {/* Pass handleUpdate as a prop */}
          <UserInfo user={user} handleUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
