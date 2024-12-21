import UserModel from '../models/UserModel';
import NotificationModel from '../models/Notification';
import { ConnectDB } from "../config/db";
import { unstable_noStore as noStore } from "next/cache";
import SupportModel from '../models/Support';
import mongoose from "mongoose"



export const getUser = async (id) => {
  try {
    ConnectDB();

    // Use `lean()` to get a plain JavaScript object
    const user = await UserModel.findById(id).lean();

    if (!user) {
      throw new Error("User not found");
    }

    // Convert `_id` to a string for compatibility with React props
    return {
      ...user,
      id: user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove `_id` if not needed
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch user");
  }
};


export const getUsers = async () =>{
    
    try{
        ConnectDB();

        const users = await UserModel.find();
        return users;

    }catch(err){
        console.log(err)
        throw new Error("Failed to Fetch Users")
    }
}



export const getNotification = async (id) => {
  try {
    await ConnectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid notification ID.");
    }

    const notification = await NotificationModel.findById(id);

    if (!notification) {
      throw new Error("Notification not found.");
    }

    return notification;
  } catch (err) {
    console.error("Error fetching notification:", err.message || err);
    throw new Error("Failed to fetch notification.");
  }
};

export const getNotifications = async () => {
  try {
    await ConnectDB();

    const notifications = await NotificationModel.find();
    return notifications.map((notification) => ({
      _id: notification._id.toString(),
      isRead: notification.isRead,
      title: notification.title,
      desc: notification.desc,
      uploadedAt: notification.uploadedAt?.toISOString(),
      createdAt: notification.createdAt?.toISOString(),
      updatedAt: notification.updatedAt?.toISOString(),
      __v: notification.__v,
    }));
  } catch (err) {
    console.error("Error fetching notifications:", err.message || err);
    throw new Error("Failed to fetch notifications.");
  }
};

export const markAsRead = async (id) => {
  try {
    await ConnectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid notification ID.");
    }

    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      throw new Error("Notification not found.");
    }

    console.log(
      "Notification successfully marked as read:",
      updatedNotification
    );
    return updatedNotification;
  } catch (err) {
    console.error("Error marking notification as read:", err.message || err);
    throw new Error("Failed to mark notification as read.");
  }
};


export const getSupport = async (id) =>{
    try{
        ConnectDB();

        const support = await SupportModel.findById(id);
        return support 

    }catch(err){
        console.log(err)
        throw new Error("Failed to Fetch Support Topic")
    }
}

export const getSupports = async () => {
  try {
    ConnectDB();

    const supports = await SupportModel.find({}).lean();

    // Ensure _id is converted to a string
    return supports.map((support) => ({
      ...support,
      id: support._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original _id field if not needed
    }));
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch all the support topics");
  }
};



