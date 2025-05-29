import { deleteInvoice } from "munichburners/lib/dreams";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string, invoice: string }> }) {
  const params = await props.params;
  const { id, invoice } = params;

  try {
    if (!id || !invoice) {
      return NextResponse.json({ error: true, message: 'Missing dreamId or invoiceId' }, { status: 400 });
    }

    await deleteInvoice(id, parseInt(invoice));

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}