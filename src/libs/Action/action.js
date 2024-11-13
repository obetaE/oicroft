"use server";

import { signOut, signIn } from "@/auth";
import { ConnectDB } from "../config/db";
import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";

// Server function to handle the form submission for product creation
export const addProduct = async () => {
  const title = formData.get("title");
  const desc = formData.get("desc");

  // Continue with other form data handling as needed
  //Be sure that the name of the input has their corresponding parameter name
  console.log(title, desc);
  //3:13
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

    const user = await UserModel.findOne({ username });
    if (user) {
      return { error: "User Already Exists" };
    }

    //installing bycrypt to use to hash the password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
  const { username, password } = Object.fromEntries(formData);

  try {
    //We are signing in using next auth credentials
    await signIn("credentials", { username, password });
  } catch (err) {
    console.log(err);

    if (err.message.includes("CredentialsSignIn")) {
      return { error: "Wrong UserName or Password" };
    }
    throw err;
  }
};
