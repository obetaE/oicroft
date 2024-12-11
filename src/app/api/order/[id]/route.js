import { ConnectDB } from "@/libs/config/db";
import { Product } from "@/libs/models/Product";

// Utility Functions
export const findPriceEntry = (product, quantity) => {
  return product.prices.find((p) => p.stock >= quantity);
};

export const updateStock = async (product, quantity) => {
  const priceEntry = findPriceEntry(product, quantity);
  if (!priceEntry) throw new Error("Insufficient stock");
  priceEntry.stock -= quantity;
  await product.save();
};

// GET Request: Fetch a product by ID
export async function GET(req, context) {
  const { params } = context;
  const { id } = await params;

  try {
    await ConnectDB();
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error fetching product" }), {
      status: 500,
    });
  }
}

// DELETE Request: Delete a product by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error deleting product" }), {
      status: 500,
    });
  }
}

// PUT Request: Update a product by ID
export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();

  try {
    await ConnectDB();
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(updatedProduct), { status: 200 });
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

    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    // Update stock using utility function
    try {
      await updateStock(product, quantity);
      return new Response(
        JSON.stringify({ message: "Stock updated", product }),
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
