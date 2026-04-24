import { getPublicFullstackDreamsForPool } from "munichburners/lib/fullstackDreams";
import { NextResponse } from "next/server";

export async function GET(_req: Request, props: { params: Promise<{ pool: string }> }) {
  const { pool } = await props.params;

  if (!pool?.trim()) {
    return NextResponse.json({ error: true, message: "Pool is required" }, { status: 400 });
  }

  try {
    const dreams = await getPublicFullstackDreamsForPool(decodeURIComponent(pool));

    return NextResponse.json({ dreams, success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to load fullstack dreams", error);

    return NextResponse.json({ error: true, message: "Dreams could not be loaded" }, { status: 500 });
  }
}
