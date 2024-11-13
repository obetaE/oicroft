import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { writeFile } from "fs/promises";


const loadDB = async () => {
  await ConnectDB();
};

loadDB();

export async function GET(request) {
  return NextResponse.json({ msg: "API WORKING" });
}

export async function POST(request) {
  // Checking and fetching form data
  const formData = await request.formData();
  if (!formData) {
    return NextResponse.json({ error: "Form data not found" }, { status: 400 });
  }

  // Handle image processing
  const image = formData.get("image");
  if (image) {
    const timestamp = Date.now();
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    // Define the path to store the image
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;
    console.log(imgUrl);

    const productData = {
      title: formData.get("title"),
      description: formData.get("description"),
    };

    return NextResponse.json({ imgUrl, productData });
  }

  return NextResponse.json({ error: "Image not found" }, { status: 400 });
}
