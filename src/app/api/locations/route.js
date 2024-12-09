import Location from "@/libs/models/Location";
import { ConnectDB } from "@/libs/config/db";

export async function POST(req) {
  try {
    await ConnectDB();
    const data = await req.json();
    const { title, description, latitude, longitude } = data;

    if (!title || !latitude || !longitude) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newLocation = new Location({ title, description, latitude, longitude });
    await newLocation.save();

    return new Response(JSON.stringify({ success: true, location: newLocation }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error saving location" }), { status: 500 });
  }
}
