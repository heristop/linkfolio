import { NextResponse } from "next/server";
import userConfig from "~/user.config";

export async function GET() {
  return NextResponse.json(userConfig);
}
