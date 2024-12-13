import Location from "@/libs/models/Location";
import { ConnectDB } from "@/libs/config/db";

export async function POST(req) {
  try {
    await ConnectDB();
    const body = await req.json();

    // Log received body for debugging
    console.log("Received Body:", body);

    const locationEntry = new Location(body);
    await locationEntry.save();

    return new Response(
      JSON.stringify({ message: "Location saved successfully!" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving location:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// GET Request: Retrieve all locations
export async function GET() {
  try {
    await ConnectDB();
    const locations = await Location.find();
    return new Response(JSON.stringify(locations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT Request: Update a location by ID
export async function PUT(req) {
  try {
    await ConnectDB();
    const body = await req.json();
    const { id, updateData } = body;

    if (!id || !updateData) {
      return new Response(
        JSON.stringify({ error: "ID and updateData are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedLocation) {
      return new Response(JSON.stringify({ error: "Location not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedLocation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE Request: Delete a location by ID
export async function DELETE(req) {
  try {
    await ConnectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return new Response(JSON.stringify({ error: "Location not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Location deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
