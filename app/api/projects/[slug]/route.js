import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOne({ slug }).lean();
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: project });
}

export async function PUT(request, { params }) {
  await connectDB();
  const { slug } = await params;
  const body = await request.json();
  const project = await Project.findOneAndUpdate({ slug }, body, { new: true, runValidators: true });
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: project });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOneAndDelete({ slug });
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Deleted" });
}