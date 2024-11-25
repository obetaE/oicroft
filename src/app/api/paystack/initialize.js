import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, amount, metadata } = req.body;

    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount,
          metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json(response.data.data); // Send the Paystack response back
    } catch (err) {
      console.error(
        "Paystack initialization error:",
        err.response?.data || err.message
      );
      res.status(500).json({ message: "Payment initialization failed" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
