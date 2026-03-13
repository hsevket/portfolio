import connectDB from "@/app/lib/mongodb";
import Article from "@/app/models/Article";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "published";
    const filter = status !== "all" ? { status } : {};

    const articles = await Article.find(filter)
      .sort("-publishedAt")
      .select("-content")
      .lean();

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const article = await Article.create(body);
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}