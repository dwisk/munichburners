import { postDream } from "munichburners/lib/dreams";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();


  try {
    const dream = await postDream(body);
    return NextResponse.json({ success: true, dream }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}

