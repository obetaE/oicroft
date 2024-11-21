import React from "react";
import ProductIdLinks from "./ProductIdLinks";
import { auth } from "@/auth";

export default async function ProductIdNav() {
   const session = await auth();

   return (
     <div>
       <ProductIdLinks session={session} id={session?.user?.id || null} />
     </div>
   );
}
