import { ConnectDB } from "@/libs/config/db";
import { Product } from "@/libs/models/Product";

export async function GET(req) {
  try {
    await ConnectDB();
    const products = await Product.find();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ConnectDB();

    const data = await req.json(); // Parse the JSON payload
    const product = await Product.create(data); // Save the product

    // Corrected: return the created product
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error creating product" }), {
      status: 500,
    });
  }
}
