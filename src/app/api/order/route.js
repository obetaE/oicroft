import { ConnectDB } from "@/libs/config/db";

export default async function handler(req, res) {
  await ConnectDB(); // Ensure the database connection is established on each request

  const { method } = req;

  if (method === "GET") {
    // Handle GET request
  }

  if (method === "POST") {
    try {
      // Handle POST request
      req.body
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
