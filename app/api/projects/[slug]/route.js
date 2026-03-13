import connectDB from "@/app/lib/mongodb";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const project = await Project.findOne({ slug: params.slug }).lean();
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: project });
}

export async function PUT(request, { params }) {
  await connectDB();
  const body = await request.json();
  const project = await Project.findOneAndUpdate({ slug: params.slug }, body, { new: true, runValidators: true });
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: project });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const project = await Project.findOneAndDelete({ slug: params.slug });
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Deleted" });
}