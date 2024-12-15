import { ConnectDB } from "@/libs/config/db";
import { Combo } from "@/libs/models/Combo";

export async function GET() {
  try {
    await ConnectDB();
    const combos = await Combo.find();
    return new Response(JSON.stringify(combos), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error fetching combos", error: err.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ConnectDB();

    const data = await req.json(); // Parse JSON payload
    const combo = await Combo.create(data); // Save the combo

    return new Response(JSON.stringify(combo), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Error creating combo", error: err.message }),
      { status: 500 }
    );
  }
}

