import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.SOURCE_COMMIT) {
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(process.env.SOURCE_COMMIT, { status: 200 });
}
