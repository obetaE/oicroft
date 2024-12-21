"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/checkout"); // Redirect to the main checkout page
    }, 2000); // Redirect after 3 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="load-img-container">
      <Image
        src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053570/Website_Page_piux2z.png"
        alt="loading image"
        width={200}
        height={200}
      />
      <div className="load-btn-container">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h1 style={{ color: "green" }}>Payment Successful!</h1>
          <p>Thank you for your purchase. Redirecting you to checkout...</p>
          {/* Add your success design here */}
        </div>
      </div>
    </div>
  );
}
