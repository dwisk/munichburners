'use client';
import { electronicFormatIBAN, isValidIBAN, isValidBIC } from 'ibantools';
import { UsageBar } from 'munichburners/components/DreamUsage';
import { Dream, StrapiFile } from 'munichburners/lib/dreams/schema';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import InvoiceCard from './InvoiceCard';

export default function DreamUpload({dream, userSecret}:{dream: Dream, userSecret: string}) {
  const [clientDream, setClientDream] = useState<Dream>(dream);
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const updateClientDream = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as keyof Dream; // Ensure the field is a key of Dream
    setClientDream((prev) => ({
      ...prev,
      [field]: ['requestMin', 'requestMax', 'grant'].includes(field) 
      ? (value ? parseFloat(value) : 0)
      : value,
    }));
  };

  const updateDream = async (setStatus = false) => {
    // Here you would typically send the updated dream to your backend
    await fetch(`/api/dreams/${clientDream.documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          bankIBAN: clientDream.bankIBAN,
          bankBIC: clientDream.bankBIC,
          bankName: clientDream.bankName,
          grantStatus: setStatus ? 'INVOICES' : undefined,
        },
        userSecret
      }),
    });
    await fetch('/api/revalidate?tag=root');
    router.refresh();

  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !clientDream.documentId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('amount', amount.toString());
      formData.append('comment', comment);
      formData.append('userSecret', userSecret);

      await fetch(`/api/dreams/${clientDream.documentId}/invoices`, {
        method: 'POST',
        body: formData,
      });
      setFile(null);
      setAmount(0);
      setComment('');
      await fetch('/api/revalidate?tag=root');
      router.refresh();
    } finally {
      setUploading(false);
    }
  };

  const usages = dream.invoices?.sort((a,b) => a.Amount > b.Amount ? -1 : 1).map((invoice) => ({
    value: invoice.Amount,
    color: "bg-white text-black bg-opacity-80 border-r-2 border-black",
    label: `${(invoice.File as StrapiFile).name+1} ${invoice.Amount}€`,
  })) || [];


  const validIBAN = isValidIBAN(electronicFormatIBAN(clientDream.bankIBAN || '') || '');
  const validBIC = isValidBIC(clientDream.bankBIC || '');

  const invoiceSum = dream.invoices?.reduce((sum, invoice) => sum + invoice.Amount, 0) || 0;

  const checks = {
    accepted: ['ACCEPTED','INVOICES','READY','PAID'].includes(dream.grantStatus || ''),
    invoicesUploaded: dream.invoices && dream.invoices.length > 0,
    invoiceSumOK: invoiceSum > 0 && invoiceSum <= (dream.grant || 0) * 1.1,
    bankDataComplete: validIBAN && validBIC && clientDream.bankName && clientDream.bankName.split(" ").length >= 2,
  };
  const allChecksOK = checks.accepted && checks.invoicesUploaded && checks.invoiceSumOK && checks.bankDataComplete;
  
  return (
    <>
      <h1 className="text-3xl">1. Rechnungen hochladen</h1>
      { dream.grantStatus === 'ACCEPTED' && (
        <div className="card relative gridpanel mb-4 rounded-lg p-4">
          <p className="text-center">Bitte lade Belege/Rechnungen für <span className="font-bold">maximal {dream.grant}€</span> hoch. Bitte lade nur Belege/Rechnungen hoch, die du für deinen Dream brauchst.</p>
          <span className="flex flex-col md:flex-row w-full gap-2">
            <input type="file" accept='.pdf,.jpg' className="file-input file-input-neutral file-input-bordered w-full" onChange={handleFileChange} />
            <label className="input input-bordered flex items-center">
              Betrag
              <input 
                type="number" 
                className="grow mx-2 text-right" 
                placeholder="123"  
                min={0} 
                value={amount}
                onChange={handleAmountChange}
              />
              €
            </label>
          </span>
          <div className="mt-2 flex flex-col md:flex-row w-full gap-2">
            <label className="input input-bordered flex grow items-center">
              Kommentar
              <input type="text" className="ml-2 text grow rounded-r-none" placeholder="Material für meinen Dream." value={comment} onChange={handleCommentChange} />
            </label>
            <button className="btn btn-md btn-neutral" onClick={handleUpload} disabled={uploading || !file || !amount}>{uploading ? 'Hochladen...' : 'Hochladen'}</button>
          </div>
        </div>
        )}
        <UsageBar max={dream.grant || 0} className="mt-4 mb-8" showLabels showMax usages={usages} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {dream.invoices?.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} dream={dream} userSecret={userSecret} actions={['UPDATE','DELETE']}/>
          ))}
        </div>

        {dream.invoiceComment && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  alt="Munich Burners"
                  width={40}
                  height={40}
                  src="/icon-vorstand.png" />
              </div>
            </div>
            <div className="chat-bubble">{dream.invoiceComment}</div>
          </div>
        )}

        <h1 className="text-3xl">2. Geld kriegen</h1>
        <div className="card relative gridpanel mb-4 rounded-lg p-4">
          <p className="text-center font-bold">Deine Bankdaten</p>
          <span className="flex flex-col md:flex-row w-full gap-2">
            <label className="input input-bordered flex items-center w-full">
              {validIBAN ? '✅' : '❌'} IBAN
              <input 
                type="text" 
                className="grow mx-2 text-left" 
                placeholder="DE89 1234 4500 0012 3456 78"
                name="bankIBAN"
                disabled={dream.grantStatus !== 'ACCEPTED'}
                value={clientDream.bankIBAN || ''}
                onChange={updateClientDream}
                min={0} 
              />
            </label>
            <label className="input input-bordered flex items-center w-full">
              {validBIC ? '✅' : '❌'} BIC
              <input 
                type="text" 
                className="grow mx-2 text-left" 
                placeholder="DEUTDEDBBER"  
                name="bankBIC"
                disabled={dream.grantStatus !== 'ACCEPTED'}
                value={clientDream.bankBIC || ''}
                onChange={updateClientDream}
                min={0} 
              />
            </label>
          </span>
          <span className="flex flex-col md:flex-row w-full gap-2 mt-2">
            <label className="input input-bordered flex items-center w-full">
            {(clientDream.bankName || '').split(" ").length >= 2 ? '✅' : '❌'} Name
            <input 
              type="text" 
              className="grow mx-2 text-left" 
              placeholder="Martina Mustermann"  
              min={0} 
              name="bankName"
              disabled={dream.grantStatus !== 'ACCEPTED'}
              value={clientDream.bankName || ''}
              onChange={updateClientDream}
              />
            </label>
            {dream.grantStatus == 'ACCEPTED' && (
              <button className="btn btn-md btn-neutral" onClick={() => updateDream()} disabled={!checks.bankDataComplete}>Speichern</button>
            )}
          </span>
        </div>
        <div className="card relative gridpanel mb-4 rounded-lg p-4">
          <p className="text-center font-bold">Zusammenfassung</p>
            { checks.accepted ?
            <div className="">✅ Du hast {dream.grant}€ zugesagt bekommen.</div> :
            <div className="font-bold">❌ Dein Dream ist noch nicht angenommen!</div>
            }
            
            { checks.invoicesUploaded ?
              <div className="">✅ Du hast {dream.invoices?.length || 0} Rechnungen hochgeladen, die insgesamt {invoiceSum}€ betragen.</div> :
              <div className="font-bold">❌ Du hast noch keine Rechnungen oder Belege hochgeladen!</div>
            }

            { checks.invoiceSumOK ?
              <div className="">✅ Das sollte klappen</div> : (checks.invoicesUploaded ?
                <div className="font-bold">❌ Das ist deutlich mehr als du zugesagt bekommen hast! Wenn es unbedingt notwendig ist, schreib Mephy.</div> 
              : null)
            }

            {checks.bankDataComplete ?
            <div className="">✅ Deine Bankdaten sind vollständig.</div> :
            <div className="font-bold">❌ Deine Bankdaten sind unvollständig!</div>
            }
            {dream.grantStatus === 'INVOICES' && (
              <div className="">✅ Deine Rechnungen sind eingereicht. Bitte hab etwas Geduld 🙂</div>
            )}
            {dream.grantStatus === 'PAID' && (
              <div className="font-bold">✅ Das Geld wurde dir überwiesen! 🎉</div>
            )}
           {dream.grantStatus === 'ACCEPTED' && (
              <button disabled={!allChecksOK} onClick={() => updateDream(true)} className="btn mt-4 btn-md btn-neutral">Rechnungen einreichen!</button>
            )}
          </div>
    </>
  )
}