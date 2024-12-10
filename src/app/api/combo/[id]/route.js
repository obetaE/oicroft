import { ConnectDB } from "@/libs/config/db";
import { Combo } from "@/libs/models/Combo";

// Utility Functions
const findPriceEntry = (combo, quantity) => {
  return combo.prices.find((p) => p.stock >= quantity);
};

const updateStock = async (combo, quantity) => {
  const priceEntry = findPriceEntry(combo, quantity);
  if (!priceEntry) throw new Error("Insufficient stock");
  priceEntry.stock -= quantity;
  await combo.save();
};

// GET Request: Fetch a combo by ID
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const combo = await Combo.findById(id);
    if (!combo) {
      return new Response(
        JSON.stringify({ message: "Combo not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(combo), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error fetching combo", error: err.message }),
      { status: 500 }
    );
  }
}

// DELETE Request: Delete a combo by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const deletedCombo = await Combo.findByIdAndDelete(id);
    if (!deletedCombo) {
      return new Response(
        JSON.stringify({ message: "Combo not found" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({ message: "Combo deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error deleting combo", error: err.message }),
      { status: 500 }
    );
  }
}

// PUT Request: Update a combo by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();

  try {
    await ConnectDB();
    const updatedCombo = await Combo.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedCombo) {
      return new Response(
        JSON.stringify({ message: "Combo not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(updatedCombo), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error updating combo", error: err.message }),
      { status: 500 }
    );
  }
}

// POST Request: Reduce stock when creating an order
export async function POST(req) {
  try {
    const { comboId, quantity } = await req.json();
    await ConnectDB();

    const combo = await Combo.findById(comboId);
    if (!combo) {
      return new Response(
        JSON.stringify({ message: "Combo not found" }),
        { status: 404 }
      );
    }

    // Update stock
    try {
      await updateStock(combo, quantity);
      return new Response(
        JSON.stringify({ message: "Stock updated", combo }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ message: error.message || "Insufficient stock" }),
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Error updating stock:", err);
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500 }
    );
  }
}
