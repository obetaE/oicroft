// src/app/api/session/route.js
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    return new Response(JSON.stringify({ user: session.user }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving session:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve session" }),
      {
        status: 500,
      }
    );
  }
}
