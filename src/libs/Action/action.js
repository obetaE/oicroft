"use server";

import { signOut, signIn } from "@/auth";
import { ConnectDB } from "../config/db";
import UserModel from "../models/UserModel";
import argon2 from "argon2";
import { Product } from "../models/Product";
import { revalidatePath } from "next/cache";
import NotificationModel from "../models/Notification";
import SupportModel from "../models/Support";
import nodemailer from "nodemailer"


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

//ACTION where you handle product or order submissions.
export const addOrder = async (formData) => {
  const { productId, quantity, unit, totalPrice, deliveryDate } =
    Object.fromEntries(formData);

  // Helper to determine order validity period
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

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Handle stock update for unit-based or counter-based products
    if (unit) {
      // Unit-based product logic
      const selectedUnit = product.prices.find((item) => item.unit === unit);
      if (!selectedUnit) {
        throw new Error(`Unit '${unit}' not found for this product`);
      }

      if (selectedUnit.stock < quantity) {
        throw new Error(
          `Insufficient stock for unit '${unit}'. Available: ${selectedUnit.stock}`
        );
      }

      // Deduct stock
      selectedUnit.stock -= quantity;
    } else {
      // Counter-based product logic
      if (!product.counter) {
        throw new Error("Counter-based product not configured");
      }

      if (product.counter.stock < quantity) {
        throw new Error(
          `Insufficient stock. Available: ${product.counter.stock}`
        );
      }

      if (
        product.counter.minQuantity &&
        quantity < product.counter.minQuantity
      ) {
        throw new Error(
          `Minimum order quantity is ${product.counter.minQuantity}`
        );
      }

      // Deduct stock
      product.counter.stock -= quantity;
    }

    // Save updated product stock
    await product.save();

    // Create and save the order
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



//ACTION TO HANDLE OUT OF STOCK
const placeOrder = async (productId, selectedUnit, quantity) => {
  try {
    // Fetch product
    const product = await Product.findById(productId);
    const unit = product.prices.find(item => item.unit === selectedUnit);

    // Validate stock
    if (!unit || unit.stock < quantity) {
      throw new Error("Insufficient stock for the selected unit.");
    }

    // Deduct stock
    unit.stock -= quantity;
    await product.save();

    console.log(`Order placed for ${quantity} ${selectedUnit}(s). Remaining stock: ${unit.stock}`);
  } catch (err) {
    console.error(err.message);
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
