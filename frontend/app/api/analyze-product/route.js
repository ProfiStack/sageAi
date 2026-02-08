export const runtime = "nodejs";

import vision from "@google-cloud/vision";
import { NextResponse } from "next/server";


console.log("ENV VALUE:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS))

const client = new vision.ImageAnnotatorClient({credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),});


export async function POST(req) {
    try {
      const formData = await req.formData();
      const image = formData.get("image");
  
      if (!image) {
        return NextResponse.json({ error: "No image" }, { status: 400 });
      }
  
      const buffer = Buffer.from(await image.arrayBuffer());
  
      const [result] = await client.textDetection({
        image: { content: buffer },
      });
  
      return NextResponse.json({
        text: result.fullTextAnnotation?.text || "",
      });
    } catch (err) {
      console.error("API ERROR:", err);
      return NextResponse.json(
        { error: "Vision API failed" },
        { status: 500 }
      );
    }
  }