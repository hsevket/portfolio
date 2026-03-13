import connectDB from "@/app/lib/mongodb";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const filter = status !== "all" ? { status } : {};

    const projects = await Project.find(filter)
      .sort("sortOrder")
      .lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}