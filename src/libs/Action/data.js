import UserModel from '../models/UserModel';
import NotificationModel from "../models/Notification";
import { ConnectDB } from "../config/db";

export const getUser = async (id) =>{
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

        const users = await UserModel.find()
        return users 

    }catch(err){
        console.log(err)
        throw new Error("Failed to Fetch User")
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


