import { ConnectDB } from "@/libs/config/db";
import { Slider } from "@/libs/models/Slider";

// Retrieve all slider entries
export async function GET() {
  try {
    await ConnectDB();

    // Fetch all sliders from the database
    const sliders = await Slider.find();

    return new Response(JSON.stringify(sliders), { status: 200 });
  } catch (err) {
    console.error("Error fetching sliders:", err.message);
    return new Response(
      JSON.stringify({ message: "Error fetching sliders", error: err.message }),
      { status: 500 }
    );
  }
}

// Create a new slider entry
export async function POST(req) {
  try {
    await ConnectDB();

    // Parse the request body
    const data = await req.json();

    // Save the slider entry to the database
    const slider = await Slider.create(data);

    return new Response(JSON.stringify(slider), { status: 201 });
  } catch (err) {
    console.error("Error creating slider:", err.message);
    return new Response(
      JSON.stringify({ message: "Error creating slider", error: err.message }),
      { status: 500 }
    );
  }
}
