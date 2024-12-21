"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FailurePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to the main checkout page
    }, 3000); // Redirect after 3 seconds

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
          <h1 style={{ color: "red" }}>Payment Failed!</h1>
          <p>Something went wrong. Redirecting you back to HomePage...</p>
          {/* Add your failure design here */}
        </div>
      </div>
    </div>
  );
}
