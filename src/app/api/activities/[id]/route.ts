import { getActivity } from 'munichburners/lib/activities';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: true, message: "ID is required" }, { status: 400 });
  }

  const locale = req.nextUrl.searchParams.get('locale') || undefined;

  try {
    const activity = await getActivity(id, locale);
    if (!activity) {
      return NextResponse.json({ error: true, message: `Activity ${id} not found for locale ${locale}` }, { status: 404 });
    }
    return NextResponse.json({ success: true, activity }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}
