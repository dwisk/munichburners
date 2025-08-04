
import { getDreams, getDreamYear } from 'munichburners/lib/dreams';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: true, message: "ID is required" }, { status: 400 });
  }

  try {
    const dreamYear = await getDreamYear(id);
    if (!dreamYear) {
      return NextResponse.json({ error: true, message: `Dream ${id} not found` }, { status: 404 });
    }

    const dreams = await getDreams(dreamYear.id.toString());
    const dreamsCSVdata = dreams.filter((dream) => dream.budgetNeed !== 'NONE').map((dream) => {
      const invoices = Math.round((dream.invoices?.reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0) * 100) / 100
      const invoicesAccepted = Math.round((dream.invoices?.filter((invoice) => invoice.reviewStatus === 'ACCEPTED').reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0) * 100) / 100;
      const invoicesDenied = Math.round((dream.invoices?.filter((invoice) => invoice.reviewStatus === 'DENIED').reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0) * 100) / 100;
      let real = dream.grant || 0;
      let accepted = dream.grant || 0;
      if (invoices > 0) {
        real = invoices;
        accepted = invoices;
      }
      if (invoicesAccepted > 0) {
        accepted = invoicesAccepted;
      }
      return ({
        name: dream.name,
        dreamer: dream.dreamer,
        requestMin: dream.requestMin,
        requestMax: dream.requestMax,
        grantStatus: dream.grantStatus,
        grant: dream.grant,
        invoices,
        invoicesAccepted,
        invoicesDenied,
        real,
        accepted,
      });
    });

    const csv = [
      Object.keys(dreamsCSVdata[0] || {}),
      ...dreamsCSVdata.map((dream) => [
        JSON.stringify(dream.name),
        JSON.stringify(dream.dreamer),
        dream.requestMin?.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.requestMax?.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.grantStatus,
        dream.grant?.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.invoices.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.invoicesAccepted.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.invoicesDenied.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.real.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        dream.accepted.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
      ]),
        ];

    return new NextResponse(
      csv.map(row => row.join(';')).join('\n'),
      {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="dreams-${dreamYear.slug}.csv"`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
  }
}