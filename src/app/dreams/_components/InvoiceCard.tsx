'use client';
import { getDreamRights } from "munichburners/lib/dreams";
import { Dream, DreamInvoice, StrapiFile } from "munichburners/lib/dreams/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface IncoiceCardProps {
  invoice: DreamInvoice;
  dream: Dream;
  userSecret: string;
  actions: ('DELETE' | 'UPDATE' | 'ACCEPT' | 'DENY')[];
}

export default function InvoiceCard({invoice, dream, userSecret, actions}: IncoiceCardProps) {
  const router = useRouter();

  const [clientInvoice, setClientInvoice] = useState<DreamInvoice>(invoice);

    const updateClientInvoice = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const field = name as keyof Dream; // Ensure the field is a key of Dream
      setClientInvoice((prev) => ({
        ...prev,
        [field]: ['Amount'].includes(field) 
        ? (value ? parseFloat(value) : 0)
        : value,
      }));
    };

  const deleteInvoice = async (invoice:DreamInvoice) => {
    await fetch(`/api/dreams/${dream.documentId}/invoices/${invoice.id}`, {
      method: 'DELETE',
    });
    await fetch('/api/revalidate?tag=root');
    router.refresh();
  }

  const updateInvoice = async (invoice:DreamInvoice) => {
    const newDream = {
      invoices: dream.invoices?.map((i) => i.id === invoice.id ? {
        File: (invoice.File as StrapiFile).id,
        Comment: clientInvoice.Comment,
        Amount: clientInvoice.Amount,
        reviewStatus: invoice.reviewStatus,
      } : {
        File: (i.File as StrapiFile).id,
        Comment: i.Comment,
        Amount: i.Amount,
        reviewStatus: i.reviewStatus,
      })
    }
    await fetch(`/api/dreams/${dream.documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: newDream,
        userSecret,
      }),
    });
    await fetch('/api/revalidate?tag=root');
    router.refresh();
  }

  const dreamRights = getDreamRights(dream, userSecret);
  const canUpdate = dreamRights.isYearRealizer || (dreamRights.isDreamer && ['ACCEPTED', 'PLANNED'].includes(dream.grantStatus || ''));
  let statusColor = '';
  if (invoice.reviewStatus === 'ACCEPTED') {
    statusColor = 'bg-green-800 bg-opacity-20';
  } else if (invoice.reviewStatus === 'DENIED') {
    statusColor = 'bg-red-800 bg-opacity-20';
  }

  return (
    <div className="card relative gridpanel rounded-lg flex flex-col">
      <Link href={(invoice.File as StrapiFile).url} className="text-lg font-bold grow pt-4 px-4">{(invoice.File as StrapiFile).name}</Link>
      <div className="p-4">
        
        <label className="input input-bordered flex grow items-center">
          Kommentar
          <input type="text"
            className="ml-2 text grow rounded-r-none"
            placeholder="Material für meinen Dream."
            value={clientInvoice.Comment}
            name="Comment"
            disabled={!dreamRights.isDreamer || !canUpdate}
            onChange={updateClientInvoice}
            />
        </label>
        

        <label className="input input-bordered flex items-center mt-2">
          Betrag
          <input 
            type="number" 
            className="grow mx-2 text-right" 
            placeholder="123"  
            min={0} 
            name="Amount"
            disabled={!canUpdate}
            value={clientInvoice.Amount}
            onChange={updateClientInvoice}
          />
          €
        </label>
      </div>

      <div className="w-full bg-black bg-opacity-20 flex justify-items-stretch gap-px leading-5">
        {/* <pre>{JSON.stringify(invoice,null,2)}</pre> */}
        <div className={`bg-black bg-opacity-60 grow p-3 text-center ${statusColor}`}>
          {invoice.Amount}€
        </div>
        { actions.includes('UPDATE') && canUpdate && (
          <button onClick={() => updateInvoice({...invoice, reviewStatus: 'REVIEW'})} className={`bg-blue-800 bg-opacity-90 font-bold p-3 text-right`}>Anpassen</button>
        )}
        { actions.includes('DELETE') && canUpdate && (
          <button onClick={() => deleteInvoice(invoice)} className={`bg-red-800 bg-opacity-90 font-bold p-3 text-right`}>Löschen</button>
        )}
        { actions.includes('ACCEPT') && canUpdate && (
          <button onClick={() => updateInvoice({...invoice, reviewStatus: 'ACCEPTED'})} className={`bg-green-800 bg-opacity-90 font-bold p-3 text-right`}>Accept</button>
        )}
        { actions.includes('DENY') && canUpdate && (
          <button onClick={() => updateInvoice({...invoice, reviewStatus: 'DENIED'})} className={`bg-red-800 bg-opacity-90 font-bold p-3 text-right`}>Deny</button>
        )}
      </div>
    </div>
  );
}