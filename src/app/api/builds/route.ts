import { NextResponse } from "next/server";

export async function GET() {
  // Phase 1 stub: builds are stored in localStorage on the client
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    pageSize: 24,
    totalPages: 0,
  });
}

export async function POST() {
  // Phase 1 stub: builds are saved to localStorage on the client
  return NextResponse.json(
    { error: "Builds are saved to localStorage in Phase 1" },
    { status: 501 }
  );
}
