import UserModel from '../models/UserModel';
import { ConnectDB } from './db';

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


