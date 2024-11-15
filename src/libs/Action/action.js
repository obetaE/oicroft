"use server";

import { signOut, signIn } from "@/auth";
import { ConnectDB } from "../config/db";
import UserModel from "../models/UserModel";
import argon2 from "argon2";
import { Product } from "../models/Product";
import { revalidatePath } from "next/cache";

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

//ACTION TO ADD USERS
export const addUser = async (previousState, formData) => {

  const { username, email, password, image } = Object.fromEntries(formData);

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
    });

    await newUser.save();
    console.log("Product Successfully Uploaded");
    revalidatePath("/admin");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Failed to Upload User" };
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
