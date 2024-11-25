import UserModel from '../models/UserModel';
import NotificationModel from "../models/Notification";
import { ConnectDB } from "../config/db";
import { unstable_noStore as noStore } from "next/cache";
import SupportModel from '../models/Support';

export const getUser = async (id) =>{
    noStore();
    try{
        ConnectDB();

        const user = await UserModel.findById(id)
        return user 

    }catch(err){
        console.log(err)
        throw new Error("Failed to Fetch User")
    }
}

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


export const getNotification = async (id) =>{
    try{
        ConnectDB();

        const notification = await NotificationModel.findById(id);
        return notification 

    }catch(err){
        console.log(err)
        throw new Error("Failed to Fetch Single Notification")
    }
}

export const getNotifications = async () =>{
    try{
        ConnectDB();

        const notifications = await NotificationModel.find()
        return notifications 

    }catch(err){
        console.log(err)
        throw new Error("Failed to Fetch Notifications")
    }
}


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



