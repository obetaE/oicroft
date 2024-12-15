import React from "react";
import Links from "./Links";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <div>
      <Links
        session={session}
        id={session?.user?.id || null}
      />
    </div>
  );
}
