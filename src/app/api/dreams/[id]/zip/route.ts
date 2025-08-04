import JSZip from 'jszip';
import { getDream } from 'munichburners/lib/dreams';
import { DreamInvoice, DreamYear, StrapiFile } from 'munichburners/lib/dreams/schema';
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

      if (!dream.invoices || dream.invoices.length === 0) {
        return NextResponse.json({ error: true, message: "No invoices found for this dream" }, { status: 404 });
      }
      
      // return NextResponse.json({ success: true, activity: dream }, { status: 200 });
      
      const invoices = await Promise.all(dream.invoices?.map(async (invoice: DreamInvoice) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${(invoice.File as StrapiFile).url}`, {});
        // const contentType = response.headers.get('Content-Type')
        const data = await response.arrayBuffer();
        return {
          ...invoice,
          data,
          // type: contentType?.replace('image/', '')
        }
      }))

      const zip = new JSZip();
      const belegNr = `${(dream.dream_year as DreamYear)?.slug || 'dream'}-${dream.id}`

      invoices.forEach((invoice) => {
        const filename = `${belegNr}/${(invoice.File as StrapiFile).name}`;
        zip.file(filename, invoice.data);
      })

      const archive = await zip.generateAsync({type: "blob"})

      return new Response(archive, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${belegNr}.zip"`
        }
      })    
    
    } catch (error) {
      return NextResponse.json({ error: true, message: (error as Error).message }, { status: 500 });
    }


}