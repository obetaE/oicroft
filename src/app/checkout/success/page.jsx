"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/checkout"); // Redirect to the main checkout page
    }, 3000); // Redirect after 3 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "green" }}>Payment Successful!</h1>
      <p>Thank you for your purchase. Redirecting you to checkout...</p>
      {/* Add your success design here */}
    </div>
  );
}
