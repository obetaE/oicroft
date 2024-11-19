import React from "react";
import SecondLinks from "./SecondLinks";
import { auth } from "@/auth";

export default async function secondnav() {
   const session = await auth();

   return (
     <div>
       <SecondLinks session={session} id={session?.user?.id || null} />
     </div>
   );
}
