import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "./mongo";
import { LandingPage } from "./schema";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { brand, desc, trackingLink, imageKey, brandColor, descColor } = body;

    if (!brand || !desc) {
      return NextResponse.json(
        { error: "Brand and desc are required" },
        { status: 400 },
      );
    }

    // Save config
    const doc = await LandingPage.create({
      brand,
      desc,
      trackingLink,
      imageUrl: imageKey,
      brandColor,
      descColor,
    });

    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("LandingPage POST error:", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const doc = await LandingPage.findOne({}, {}, { sort: { createdAt: -1 } });
    if (!doc) {
      return NextResponse.json({ error: "No config found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("LandingPage GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 },
    );
  }
}
