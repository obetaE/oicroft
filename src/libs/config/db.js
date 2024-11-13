
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const connection = {};

export const ConnectDB = async () => {
  try{
      if(connection.isConnected){
        console.log("Using Existing Connection");
        return;
      }
    const db = await mongoose.connect(process.env.MONGODB_URL);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected");}
    catch(error){
      console.log(error)
      throw new NextResponse ("Error Connecting to DataBase")

    }
}
