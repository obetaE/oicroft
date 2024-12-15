"use server";

import { signOut, signIn } from "@/auth";
import { ConnectDB } from "../config/db";
import UserModel from "../models/UserModel";
import argon2 from "argon2";
import { Product } from "../models/Product";
import {Animal} from "../models/Animal"
import {Combo} from "../models/Combo"
import { revalidatePath } from "next/cache";
import NotificationModel from "../models/Notification";
import SupportModel from "../models/Support";
import nodemailer from "nodemailer"



//DELETING ANIMAL BYPRODUCT
export const deleteCombo = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await Combo.findByIdAndDelete(id);
    console.log("Deleted from the Database")
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete Combo" };
  }
}

//DELETING ANIMAL BYPRODUCT
export const deleteByProduct = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await Animal.findByIdAndDelete(id);
    console.log("Deleted from the Database")
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete ByProduct" };
  }
}


//DELETING PRODUCT
export const deleteProduct = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await Product.findByIdAndDelete(id);
    console.log("Deleted from the Database")
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete Post" };
  }
}


//ACTION FOR ADDING A NOTICATION
export const addNotification = async (formData) =>{
  const {title, desc}= Object.fromEntries(formData);

  try{
    ConnectDB();
    const newNotification = new NotificationModel({title, desc})

    await newNotification.save();
    console.log("Notification Successfully Uploaded to DB")
  }catch(err){
    console.log(err)
    return {error: "Failed to upload Notification"}
  }
} 

//DELETING NOTIFICATION
export const deleteNotification = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await NotificationModel.findByIdAndDelete(id);
    console.log("Deleted from the Database")
    revalidatePath("/notifications");
    revalidatePath("/admin");
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete Post" };
  }
}



//ACTION FOR ADDING A SUPPORT TOPIC AND ANSWER
export const addSupport = async (formData) =>{
  const {title, desc}= Object.fromEntries(formData);

  try{
    ConnectDB();
    const newSupport = new SupportModel({title, desc})

    await newSupport.save();
    console.log("Support Topic Successfully Uploaded to DB")
  }catch(err){
    console.log(err)
    return {error: "Failed to upload Support Topic"}
  }
} 

//DELETING A SUPPORT TOPIC AND ANSWER
export const deleteSupport = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await SupportModel.findByIdAndDelete(id);
    console.log("Deleted from the Database")
    revalidatePath("/support");
    revalidatePath("/admin");
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete Support Topic" };
  }
}

//ACTION TO ADD USERS
export const addUser = async (previousState, formData) => {

  const { username, email, password, image, isAdmin, isWorker } = Object.fromEntries(formData);

  try {
    ConnectDB();

    // Replace bcrypt with Argon2 for password hashing
    const argon2 = require("argon2");
    const hashedPassword = await argon2.hash(password);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      image,
      isAdmin,
      isWorker,
    });

    await newUser.save();
    console.log("User Successfully Uploaded From Admin Panel");
    revalidatePath("/admin");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Failed to Upload User" };
  }
};


//ACTION TO UPDATE USER INFO
export const updateUser = async (id, formData) => {
  console.log("Updating user with ID:", id); // Debugging ID
  console.log("FormData:", formData);

  if (!formData) {
    console.error("formData is undefined");
    return { error: "Form data is missing" };
  }

  const { username, email, password, image, passwordRepeat, number } = formData;

  if (password !== passwordRepeat) {
    return { error: "Passwords don't match" };
  }

  try {
    ConnectDB();

    // Check if the user exists
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      console.error(`No user found with ID: ${id}`);
      return { error: "User not found" };
    }

    // Dynamically build the updated data object
    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (number) updatedData.number = number;
    if (image) updatedData.image = image;
    if (password) updatedData.password = await argon2.hash(password);

    console.log("Updating user with data:", updatedData); // Debugging data

    // Attempt the update
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      console.error(`Failed to update user with ID: ${id}`);
      return { error: "Failed to update user" };
    }

    console.log("User successfully updated:", updatedUser);
    return updatedUser;
  } catch (err) {
    console.error("Error in updateUser:", err);
    return { error: "Failed to update user" };
  }
};





//DELETING USERS
export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    ConnectDB();

    // Find user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return { error: "User not found" };
    }

    // Check if the user's email is restricted
    const restrictedEmails = ["ericobeta14@gmail.com", "adanuonazi@gmail.com"];
    if (restrictedEmails.includes(user.email)) {
      return { error: "Can't delete Owners" };
    }

    // Proceed to delete user
    await UserModel.findByIdAndDelete(id);
    console.log("Deleted from the Database");

    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Failed to Delete User" };
  }
};



//ACTION TO HANDLE LOGOUT
export const handleLogout = async () => {
  await signOut();
};

//ACTION TO HANDLE GOOGLE LOGIN
export const googleLogin = async () => {
  await signIn("google", { redirectTo: "/" });
};

//ACTION FOR USER REGISTRATION
export const register = async (previousState, formData) => {
  const { username, email, password, image, passwordRepeat, number } =
    Object.fromEntries(formData);

  if (password !== passwordRepeat) {
    return { error: "Passwords don't match" };
  }

  try {
    ConnectDB();

    const user = await UserModel.findOne({ email });
    if (user) {
      return { error: "User Already Exists" };
    }

    // Replace bcrypt with Argon2 for password hashing
    const argon2 = require("argon2");
    const hashedPassword = await argon2.hash(password);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      image,
      number,
    });

    await newUser.save();
    console.log("Saved to Database");

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

        const verificationLink = `${process.env.BASE_URL}/verify?token=${newUser.verificationToken}`;
        await transporter.sendMail({
          from: `"Oicroft" <${process.env.EMAIL_USER}>`,
          to: newUser.email,
          subject: "Verify Your Email",
          html: `
    <div style="font-family: Arial, sans-serif;">
      <!-- Header -->
      <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

      <!-- Content -->
      <div style="padding: 1rem;">
        <h1>Verify Your Email Address</h1>
        <p>Click the link below to verify your email address and activate your account:</p>
        <a href="${verificationLink}" style="color: #19831c; font-weight: bold;">Verify Email</a>
      </div>

      <!-- Footer -->
      <div style="
        background-color: #19831c; 
        color: white; 
        text-align: center; 
        padding: 1rem; 
        margin-top: 1rem;
      ">
        <p>Follow us on social media:</p>
        <a href="mailto:oicroftco@gmail.com"><img src="cid:Email" alt="Email" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://www.facebook.com/profile.php?id=61558022143571"><img src="cid:Facebook" alt="Facebook" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://x.com/Oicroft?t=xAfAW9Gz0kkdsk7pzjOcxQ&s=09"><img src="cid:Twitter" alt="Twitter" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://www.instagram.com/oicroft?igsh=MWY5a3Z2emt3eXBuZQ=="><img src="cid:Instagram" alt="Instagram" style="width: 32px; margin: 0 5px;" /></a>
      </div>
    </div>
  `,
          attachments: [
            {
              filename: "Email Header.png",
              path: "./public/Email Header.png",
              cid: "headerImage", // Same CID for referencing in the HTML
            },
            {
              filename: "Email.png",
              path: "./public/Email.png",
              cid: "Email", // Same CID for referencing in the HTML
            },
            {
              filename: "Facebook.png",
              path: "./public/Facebook.png",
              cid: "Facebook", // Same CID for referencing in the HTML
            },
            {
              filename: "Twitter.png",
              path: "./public/Twitter.png",
              cid: "Twitter", // Same CID for referencing in the HTML
            },
            {
              filename: "Instagram.png",
              path: "./public/Instagram.png",
              cid: "Instagram", // Same CID for referencing in the HTML
            },
          ],
        });

        console.log("Verification email sent");

        //WELCOME EMAIL
        await transporter.sendMail({
  from: `"Oicroft" <${process.env.EMAIL_USER}>`,
  to: newUser.email,
  subject: "Welcome to Oicroft!",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <!-- Header -->
      <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

      <!-- Content -->
      <div style="padding: 1rem;">
        <h1>Welcome, ${newUser.username}!</h1>
        <p style="font-size: 16px; color: #333;">
          We're thrilled to have you join the Oicroft family! Your account has been successfully created, 
          and you're all set to explore our platform and services.
        </p>
        <p style="font-size: 16px; color: #333;">
          If you ever need assistance, feel free to reach out to our support team or visit our 
          <a href="${process.env.BASE_URL}/help" style="color: #19831c;">Help Center</a>. 
          We're here to ensure you have a seamless experience.
        </p>
        <p style="font-size: 16px; color: #333;">
          As a valued member, you'll receive updates, tips, and exciting news directly to your inbox. 
          Stay tuned for what's to come!
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background-color: #19831c; 
        color: white; 
        text-align: center; 
        padding: 1rem; 
        margin-top: 1rem;
      ">
        <p>Follow us on social media:</p>
        <a href="mailto:oicroftco@gmail.com"><img src="cid:Email" alt="Email" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://www.facebook.com/profile.php?id=61558022143571"><img src="cid:Facebook" alt="Facebook" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://x.com/Oicroft?t=xAfAW9Gz0kkdsk7pzjOcxQ&s=09"><img src="cid:Twitter" alt="Twitter" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://www.instagram.com/oicroft?igsh=MWY5a3Z2emt3eXBuZQ=="><img src="cid:Instagram" alt="Instagram" style="width: 32px; margin: 0 5px;" /></a>
      </div>
    </div>
  `,
  attachments: [
    {
      filename: "Email Header.png",
      path: "./public/Email Header.png",
      cid: "headerImage", // Same CID for referencing in the HTML
    },
    {
      filename: "Email.png",
      path: "./public/Email.png",
      cid: "Email", // Same CID for referencing in the HTML
    },
    {
      filename: "Facebook.png",
      path: "./public/Facebook.png",
      cid: "Facebook", // Same CID for referencing in the HTML
    },
    {
      filename: "Twitter.png",
      path: "./public/Twitter.png",
      cid: "Twitter", // Same CID for referencing in the HTML
    },
    {
      filename: "Instagram.png",
      path: "./public/Instagram.png",
      cid: "Instagram", // Same CID for referencing in the HTML
    },
  ],
});


console.log("Welcome Email has been sent")

    return { success: true  };
  } catch (err) {
    console.log(err);
    return { error: "Failed to Register User" };
  }
};

//ACTION HANDLING LOGIN
export const login = async (previousState, formData) => {
  const { email, password } = Object.fromEntries(formData);

  try {
    //We are signing in using next auth credentials
    await signIn("credentials", { email, password });
  } catch (err) {
    console.log(err);

    if (err.message.includes("CredentialsSignIn")) {
      return { error: "Wrong UserName or Password" };
    }
    throw err;
  }
};
