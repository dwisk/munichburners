import { NextRequest, NextResponse } from 'next/server';
import { uploadInvoice } from 'munichburners/lib/dreams';

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const dreamId = id;
    // Parse form data (multipart/form-data)
    const formData = await req.formData();
    const file = formData.get('file');
    const amount = formData.get('amount');
    const comment = formData.get('comment');

    if (!file || !(file instanceof File) || typeof dreamId !== 'string' || typeof amount !== 'string') {
      return NextResponse.json({ error: true, message: 'Missing required fields' }, { status: 400 });
    }

    const dream = await uploadInvoice(file, dreamId, parseFloat(amount), comment as string);
    return NextResponse.json({ success: true, dream }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}
