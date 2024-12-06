"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference"); // Extract reference from URL query

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  const verifyPayment = async (reference) => {
    try {
      const response = await fetch(
        `/api/paystack/verify?reference=${reference}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify payment");
      }

      const data = await response.json();
      if (data.status === "success") {
        alert("Payment verified successfully!");
        console.log("Payment details:", data);
        // Handle post-payment logic (e.g., order confirmation)
      } else {
        alert("Payment verification failed or pending.");
      }
    } catch (err) {
      console.error("Error verifying payment:", err.message);
      alert(`Error verifying payment: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Payment Verification</h1>
      <p>Verifying your payment...</p>
    </div>
  );
};

export default SuccessPage;
