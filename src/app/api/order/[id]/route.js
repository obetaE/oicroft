import { ConnectDB } from "@/libs/config/db";
import { Product } from "@/libs/models/Product";

export async function GET(req, { params }) {
  const { id } = params;

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

export async function PUT(req, { params }) {
  const { id } = params;
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
