import Delivery from "@/libs/models/Delivery";
import { ConnectDB } from "@/libs/config/db";

export async function GET(req, { params }) {
  const { id } = params;
  try{
    await ConnectDB();
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return new Response(JSON.stringify({ error: "Delivery not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(delivery), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }catch(err){
    console.log(err)
    return new Response(
      JSON.stringify({ message: "Error fetching combo", error: err.message }),
      { status: 500 }
    );
  }
}
