import { ConnectDB } from "@/libs/config/db";
import { Slider } from "@/libs/models/Slider";

// Get a single slider by ID
export async function GET(req, context) {
  try {
    await ConnectDB();
    const { id } = await context.params; // Await context.params
    const slider = await Slider.findById(id);
    if (!slider) {
      return new Response(JSON.stringify({ message: "Slider not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(slider), { status: 200 });
  } catch (err) {
    console.error("Error fetching slider:", err.message);
    return new Response(
      JSON.stringify({
        message: "Error fetching slider",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}

// Delete a slider by ID
export async function DELETE(req, context) {
  try {
    await ConnectDB();
    const { id } = await context.params; // Await context.params
    const deletedSlider = await Slider.findByIdAndDelete(id);
    if (!deletedSlider) {
      return new Response(JSON.stringify({ message: "Slider not found" }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({ message: "Slider deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting slider:", err.message);
    return new Response(
      JSON.stringify({
        message: "Error deleting slider",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}

// Update a slider by ID
export async function PUT(req, context) {
  try {
    const data = await req.json();
    await ConnectDB();
    const { id } = await context.params; // Await context.params
    const updatedSlider = await Slider.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedSlider) {
      return new Response(JSON.stringify({ message: "Slider not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(updatedSlider), { status: 200 });
  } catch (err) {
    console.error("Error updating slider:", err.message);
    return new Response(
      JSON.stringify({
        message: "Error updating slider",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
