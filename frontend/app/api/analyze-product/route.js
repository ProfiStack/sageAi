export const runtime = "nodejs";

import vision from "@google-cloud/vision";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Lazy-initialised so the env var is read at request time (runtime),
// not at module evaluation time during the Next.js build where it is undefined.
let _visionClient = null;
function getVisionClient() {
  if (_visionClient) return _visionClient;
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!raw) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS env var is not set.");
  }
  _visionClient = new vision.ImageAnnotatorClient({
    credentials: JSON.parse(raw),
  });
  return _visionClient;
}

export async function POST(req) {
  try {
    const client = getVisionClient();

    const formData = await req.formData();
    const image = formData.get("image");
    const clientBarcode = formData.get("barcode");
    const barcodeFormat = formData.get("barcodeFormat");

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    let buffer = Buffer.from(await image.arrayBuffer());

    // Only resize if image is huge, otherwise keep original quality
    const metadata = await sharp(buffer).metadata();
    const needsResize = metadata.width > 3000 || metadata.height > 3000;

    if (needsResize) {
      buffer = await sharp(buffer)
        .resize(3000, 3000, { fit: "inside", withoutEnlargement: true })
        .toBuffer();
    }

    // Create two versions: one for barcode detection, one for analysis
    const barcodeBuffer = await sharp(buffer)
      .greyscale()
      .normalise()
      .sharpen({ sigma: 1 })
      .toBuffer();

    const analysisBuffer = await sharp(buffer).normalize().toBuffer();

    // Try barcode detection with both buffers
    const [barcodeResult] = await client.annotateImage({
      image: { content: barcodeBuffer },
      features: [{ type: "BARCODE_DETECTION", maxResults: 10 }],
    });

    const [analysisResult] = await client.annotateImage({
      image: { content: analysisBuffer },
      features: [{ type: "TEXT_DETECTION" }],
    });

    const visionBarcodes = barcodeResult.barcodeAnnotations || [];
    const fullText = analysisResult.fullTextAnnotation?.text || "";

    // ✅ Combine all barcode detection methods
    const allBarcodes = [];

    // 1. Client-side ZXing detection (HIGHEST PRIORITY - most reliable)
    if (clientBarcode) {
      allBarcodes.push({
        value: clientBarcode,
        format: barcodeFormat || "UNKNOWN",
        source: "zxing_client",
        confidence: "high",
        type: is2DBarcode(barcodeFormat) ? "2D" : "1D",
      });
    }

    // 2. Google Vision barcode detection
    visionBarcodes.forEach((bc) => {
      // Don't add if already detected by ZXing
      if (!allBarcodes.find((b) => b.value === bc.rawValue)) {
        allBarcodes.push({
          value: bc.rawValue,
          format: bc.format || "UNKNOWN",
          source: "google_vision",
          confidence: "high",
          type: is2DBarcode(bc.format) ? "2D" : "1D",
        });
      }
    });

    // 3. Text extraction (only for 1D barcodes as fallback)
    if (allBarcodes.length === 0) {
      const textBarcodes = extractBarcodesFromText(fullText);
      textBarcodes.forEach((bc) => {
        allBarcodes.push({
          value: bc,
          format: "EXTRACTED_FROM_TEXT",
          source: "text_ocr",
          confidence: "medium",
          type: "1D",
        });
      });
    }

    return NextResponse.json({
      barcodes: allBarcodes,
      primaryBarcode: allBarcodes[0] || null,
      text: fullText,
      logos: analysisResult.logoAnnotations || [],
      objects: analysisResult.localizedObjectAnnotations || [],
      colors:
        analysisResult.imagePropertiesAnnotation?.dominantColors?.colors || [],
      safeSearch: analysisResult.safeSearchAnnotation || {},
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      {
        error: "Vision API failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

// ✅ Helper: Check if barcode format is 2D
function is2DBarcode(format) {
  const format2D = [
    "QR_CODE",
    "DATA_MATRIX",
    "PDF_417",
    "AZTEC",
    "MAXICODE",
    "QR_CODE_MODE_FNC1", // Additional QR variants
  ];
  return format2D.some((f) => format?.includes(f));
}

// ✅ Helper: Extract barcodes from text (for 1D only)
function extractBarcodesFromText(text) {
  if (!text) return [];

  const barcodes = [];
  const patterns = [
    /\b\d{13}\b/g, // EAN-13
    /\b\d{12}\b/g, // UPC-A
    /\b\d{8}\b/g, // EAN-8
    /\b\d{4}\s*\d{4}\b/g, // 8 digits with space
  ];

  patterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const clean = match.replace(/\s+/g, "");
        if (!barcodes.includes(clean)) {
          barcodes.push(clean);
        }
      });
    }
  });

  return barcodes;
}
