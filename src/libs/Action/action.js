"use server";

import { signOut, signIn } from "@/auth";
import { ConnectDB } from "../config/db";
import UserModel from "../models/UserModel";
import argon2 from "argon2";
import { Product } from "../models/Product";
import { revalidatePath } from "next/cache";
import NotificationModel from "../models/Notification";

// Server function to handle the form submission for product creation
export const addProduct = async (previousState, formData) => {
  // const title = formData.get("title");
  // const desc = formData.get("desc");

  // // Continue with other form data handling as needed
  // //Be sure that the name of the input has their corresponding parameter name
  // console.log(title, desc);
  // //3:13

  const { title, desc, prices, productId } = Object.fromEntries(formData);

  try {
    ConnectDB();
    const newProduct = new Product({ title, desc, prices, productId });

    await newProduct.save();
    console.log("Product Successfully Uploaded");
    revalidatePath("/order");
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Failed to Upload Product" };
  }
};


//DELETING PRODUCT
export const deleteProduct = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await Product.findByIdAndDelete(id);
    console.log("Deleted from the Database")
    revalidatePath("/order");
    revalidatePath("/admin");
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete Post" };
  }
}

//action.js file where you handle product or order submissions.
export const addOrder = async (formData) => {
  const { productId, quantity, unit, totalPrice, deliveryDate } =
    Object.fromEntries(formData);

  // Get the current valid order period
  const getOrderPeriod = () => {
    const now = new Date();
    const currentDay = now.getDay();

    // Determine this week's Thursday
    const daysToThursday =
      currentDay <= 4 ? 4 - currentDay : 4 + (7 - currentDay);
    const thursday = new Date(now);
    thursday.setDate(now.getDate() + daysToThursday);
    thursday.setHours(0, 0, 0, 0);

    // Determine next week's Wednesday
    const wednesday = new Date(thursday);
    wednesday.setDate(thursday.getDate() + 6);
    wednesday.setHours(23, 59, 59, 999);

    return { thursday, wednesday };
  };

  const { thursday, wednesday } = getOrderPeriod();
  const orderDate = new Date();

  // Validate the order date
  if (orderDate < thursday || orderDate > wednesday) {
    throw new Error(
      "Orders can only be placed for the current Thursday-Wednesday period."
    );
  }

  try {
    ConnectDB();

    const newOrder = new Order({
      productId,
      quantity,
      unit,
      totalPrice,
      orderDate,
      deliveryDate,
    });

    await newOrder.save();
    console.log("Order successfully created");
    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Failed to create order" };
  }
};

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
export const updateUser = async (id, updatedData) => {
  try {
    ConnectDB();

    // Find user by ID and update fields
    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    console.log("User successfully updated", updatedUser);
    return updatedUser;
  } catch (err) {
    console.log(err);
    return { error: "Failed to update user" };
  }
};


//DELETING USERS
export const deleteUser = async (formData) => {
  const {id} = Object.fromEntries(formData);

  try{
    ConnectDB();

    await UserModel.findByIdAndDelete(id);
    console.log("Deleted from the Database")
    revalidatePath("/admin")
  }catch(err){
    console.log(err);
    return { error: "Failed to Delete User" };
  }
}

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

    return { success: true };
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
