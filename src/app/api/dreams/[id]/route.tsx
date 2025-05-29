import { getDream, updateDream } from 'munichburners/lib/dreams';
import { DreamYear } from 'munichburners/lib/dreams/schema';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: true, message: "ID is required" }, { status: 400 });
  }

  try {
    const dream = await getDream(id);
    if (!dream) {
      return NextResponse.json({ error: true, message: `Dream ${id} not found` }, { status: 404 });
    }
    return NextResponse.json({ success: true, activity: dream }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: true, message: "ID is required" }, { status: 400 });
  }

  try {
    const dream = await getDream(id);
    const body = await req.json();

    if (!dream || !dream.documentId) {
      return NextResponse.json({ error: true, message: `Dream ${id} not found` }, { status: 404 });
    }

    const dreamYearRealizers = (dream.dream_year as DreamYear).realizers.map((r) => r.Secret);
    console.log("Dream Year Realizers", dreamYearRealizers);
    console.log("User Secret", body.userSecret);

    if (dream.dreamerSecret !== body.dreamerSecret && dreamYearRealizers.indexOf(body.userSecret) === -1) {
      return NextResponse.json({ error: true, message: "You are not allowed to update this dream" }, { status: 403 });
    }
    const newDream = await updateDream(dream.documentId, body.data);
    revalidateTag(`root`);
    return NextResponse.json({ success: true, newDream }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}
