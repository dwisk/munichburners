import { getDream, getDreamRights, updateDream } from 'munichburners/lib/dreams';
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

    const dreamRights = getDreamRights(dream, body.userSecret);

    if (!dreamRights.isDreamer && !dreamRights.isYearRealizer) {
      return NextResponse.json({ error: true, message: "You are not allowed to update this dream" }, { status: 403 });
    }

    if (!dreamRights.isYearRealizer) {
      // check allowed fields for dreamer
      const allowedFields = ['name', 'budgetNeed', 'requestMinReason', 'requestMaxReason', 'invoices', 'bankIBAN', 'bankBIC', 'bankName', 'grantStatus', 'addressStreet', 'addressZipcode', 'addressCity', 'addressCountry'];
      const bodyKeys = Object.keys(body.data);
      for (const key of bodyKeys) {
        if (!allowedFields.includes(key)) {
          return NextResponse.json({ error: true, message: `You are not allowed to update the field ${key}` }, { status: 403 });
        }
      }

      if (body.data.grantStatus && body.data.grantStatus !== 'INVOICES') {
        return NextResponse.json({ error: true, message: "You can only update the dream to INVOICES status" }, { status: 403 });
      }

    }
    

    const newDream = await updateDream(dream.documentId, body.data);
    revalidateTag(`root`);
    return NextResponse.json({ success: true, newDream }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}
