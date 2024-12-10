import { ConnectDB } from "@/libs/config/db";
import { Animal } from "@/libs/models/Animal";

// Utility Functions
export const findPriceEntry = (animal, quantity) => {
  return animal.prices.find((p) => p.stock >= quantity);
};

export const updateStock = async (animal, quantity) => {
  const priceEntry = findPriceEntry(animal, quantity);
  if (!priceEntry) throw new Error("Insufficient stock");
  priceEntry.stock -= quantity;
  await animal.save();
};

// GET Request: Fetch a product by ID
export async function GET(req, context) {
  const { params } = context;
  const { id } = await params;

  try {
    await ConnectDB();
    const animal = await Animal.findById(id);
    if (!animal) {
      return new Response(JSON.stringify({ message: "Animal ByProduct not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(animal), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error fetching animal byproduct" }), {
      status: 500,
    });
  }
}

// DELETE Request: Delete a product by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const deletedAnimal = await Animal.findByIdAndDelete(id);
    if (!deletedAnimal) {
      return new Response(JSON.stringify({ message: "Animal not found" }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({ message: "Animal ByProduct deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error deleting Animal byproduct" }), {
      status: 500,
    });
  }
}

// PUT Request: Update a product by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();

  try {
    await ConnectDB();
    const updatedAnimal = await Animal.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedAnimal) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(updatedAnimal), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error updating product" }), {
      status: 500,
    });
  }
}

// POST Request: Reduce stock when creating an order
export async function POST(req) {
  try {
    const { productId, quantity } = await req.json();
    await ConnectDB();

    const animal = await Animal.findById(productId);
    if (!animal) {
      return new Response(JSON.stringify({ error: "Animal ByProduct not found" }), {
        status: 404,
      });
    }

    // Update stock using utility function
    try {
      await updateStock(animal, quantity);
      return new Response(
        JSON.stringify({ message: "Stock updated", animal }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message || "Insufficient stock" }),
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Error updating stock:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
