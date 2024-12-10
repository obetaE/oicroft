import { ConnectDB } from "@/libs/config/db";
import { Animal } from "@/libs/models/Animal";

export async function GET(req) {
  try {
    await ConnectDB();
    const animal = await Animal.find();
    return new Response(JSON.stringify(animal), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error fetching Animal ByProducts" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ConnectDB();

    const data = await req.json(); // Parse the JSON payload
    const animal = await Animal.create(data); // Save the product

    // Corrected: return the created product
    return new Response(JSON.stringify(animal), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error creating animal byproduct" }), {
      status: 500,
    });
  }
}
