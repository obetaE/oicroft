import { ConnectDB } from "@/libs/config/db";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";

const loadBD = async () => {
    await ConnectDB()
}

loadBD();

  
  
   export default async function handler(req , res ){
         const {method} = req
    
         if (method === "GET"){ 
        
         }
    
       if (method === "POST"){
                 try {
            
               } catch (err) {
                        console.log(err);
                        return new NextResponse(
                          JSON.stringify({ message: "Something went wrong" }),
                          { status: 200 }
                        );
            
                     }
                 }
             }
            

        
 