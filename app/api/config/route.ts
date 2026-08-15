import { NextResponse } from "next/server";
import userConfig from "~/user.config";

export async function GET() {
  return NextResponse.json(userConfig, {
    // robots.txt disallows /api/, which stops crawling but not indexing: a
    // disallowed URL someone links to can still be listed, headline-only.
    // The header travels with the response and settles it either way.
    headers: { "X-Robots-Tag": "noindex" },
  });
}
