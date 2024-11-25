import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { reference } = req.query;

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      res.status(200).json(response.data.data); // Send the verification result
    } catch (err) {
      console.error(
        "Paystack verification error:",
        err.response?.data || err.message
      );
      res.status(500).json({ message: "Payment verification failed" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
