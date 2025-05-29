'use client';
import { UsageBar } from "munichburners/components/DreamUsage";
import InvoiceCard from "./InvoiceCard";
import { Dream, StrapiFile } from "munichburners/lib/dreams/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DreamReview({dream, userSecret}:{dream: Dream, userSecret: string}) {
  const [invoiceComment, setInvoiceComment] = useState<string>(dream.invoiceComment || '');
  const router = useRouter();

  if (!dream.invoices || dream.invoices.length === 0) {
    return null;
  }

  const updateDream = async (status: 'INVOICES' | 'PAID' | 'ACCEPTED' | 'READY') => {
    // Here you would typically send the updated dream to your backend
    await fetch(`/api/dreams/${dream.documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          invoiceComment: invoiceComment || '',
          grantStatus: status,
        },
        userSecret
      }),
    });
    await fetch('/api/revalidate?tag=root');
    router.refresh();
  }

  const usages = dream.invoices?.sort((a,b) => a.Amount > b.Amount ? -1 : 1).map((invoice) => ({
    value: invoice.Amount,
    color: "bg-white text-black bg-opacity-80 border-r-2 border-black",
    label: `${(invoice.File as StrapiFile).name+1} ${invoice.Amount}€`,
  })) || [];
    
  return (<>
      <h1 className="text-3xl">Geld freigeben</h1>
      <UsageBar max={dream.grant} className="mt-4 mb-8" showLabels showMax usages={usages} />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
      {dream.invoices?.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} dream={dream} userSecret={userSecret} actions={['UPDATE','ACCEPT','DENY']}/>          
      ))}
    </div>

    <div key={dream.id} className="card relative gridpanel mb-4 rounded-lg">
      <p className="p-4">
        <label className="input input-bordered flex grow items-center">
          Kommentar
          <input 
          type="text" 
          className="ml-2 text grow rounded-r-none" 
          placeholder="Danke für deinen Dream." 
          name="comment" 
          value={invoiceComment} 
          onChange={(e) => setInvoiceComment(e.target.value)}
        />
        </label>
      </p>
        <div className="flex w-full">
          <button onClick={() => updateDream('ACCEPTED')} className={`btn rounded-none border-none text-white bg-yellow-600 bg-opacity-40 p-3 grow ${dream.grantStatus === 'ACCEPTED' ? 'font-bold bg-opacity-90' : 'font-normal'}`}>Reset</button>
          <button onClick={() => updateDream('INVOICES')} className={`btn rounded-none border-none text-white bg-cyan-600 bg-opacity-40 p-3 grow ${dream.grantStatus === 'INVOICES' ? 'font-bold bg-opacity-90' : 'font-normal'}`}>Invoices</button>
          <button onClick={() => updateDream('READY')} className={`btn rounded-none border-none text-white bg-lime-600 bg-opacity-40 p-3 grow ${dream.grantStatus === 'READY' ? 'font-bold bg-opacity-90' : 'font-normal'}`}>Ready</button>
          <button onClick={() => updateDream('PAID')} className={`btn rounded-none border-none text-white bg-green-600 bg-opacity-40 p-3 grow ${dream.grantStatus === 'PAID' ? 'font-bold bg-opacity-90' : 'font-normal'}`}>Paid</button>
        </div>
    </div>

    <button className="btn btn-lg btn-neutral mt-4 w-full">Belege als .zip herunterladen</button>

  </>);
}