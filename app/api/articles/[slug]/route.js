import connectDB from "@/app/lib/mongodb";
import Article from "@/app/models/Article";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const article = await Article.findOne({ slug: params.slug }).lean();
  if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  Article.updateOne({ slug: params.slug }, { $inc: { views: 1 } }).exec();
  return NextResponse.json({ success: true, data: article });
}

export async function PUT(request, { params }) {
  await connectDB();
  const body = await request.json();
  const article = await Article.findOneAndUpdate({ slug: params.slug }, body, { new: true, runValidators: true });
  if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: article });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const article = await Article.findOneAndDelete({ slug: params.slug });
  if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Deleted" });
}