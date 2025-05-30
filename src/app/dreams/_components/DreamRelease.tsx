'use client';
import { getDreamColor } from 'munichburners/lib/dreams';
import { Dream } from 'munichburners/lib/dreams/schema';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

export default function DreamRelease({dream, userSecret}:{dream: Dream, userSecret: string}) {
  const [clientDream, setClientDream] = useState<Dream>(dream);
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

  const updateDream = async (status: 'OPEN' | 'PLANNED' | 'CANCELED' | 'ACCEPTED') => {
    // Here you would typically send the updated dream to your backend
    await fetch(`/api/dreams/${clientDream.documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          requestMin: clientDream.requestMin,
          requestMax: clientDream.requestMax,
          grant: clientDream.grant,
          grantStatus: status,
          dreamerSecret: clientDream.dreamerSecret || '',
          comment: clientDream.comment || '',
        },
        userSecret
      }),
    });
    await fetch('/api/revalidate?tag=root');
    router.refresh();

  }

  return (
    <>
      <h1 className="text-3xl">Dream freigeben</h1>
      <div key={clientDream.id} className="card relative gridpanel mb-4 rounded-lg">
        <div className="flex gap-4 p-4 flex-col md:flex-row">
          <p className="md:w-1/2">
            <strong className="font-bold">Minimum Request:</strong><br />
            {clientDream.requestMinReason}
          </p>
          <p className="!mt-0 md:w-1/2">
            <strong className="font-bold">Maximum Request:</strong><br />
            {clientDream.requestMaxReason}
          </p>
        </div>
        <span className="flex flex-col md:flex-row gap-2 px-4 mb-2">
          <label className="input input-bordered flex items-center md:w-1/2">
            Min
            <input 
              type="number"
              name='requestMin'
              className="w-full grow mx-2 text-right" 
              placeholder="123"  
              min={0} 
              value={clientDream.requestMin}
              onChange={updateClientDream}
            />
            €
          </label>
          <label className="input input-bordered flex items-center md:w-1/2">
            Max
            <input 
              type="number" 
              className="w-full grow mx-2 text-right" 
              placeholder="123"  
              min={0} 
              name='requestMax'
              value={clientDream.requestMax}
              onChange={updateClientDream}
            />
            €
          </label>
        </span>
        <span className="flex flex-col md:flex-row gap-2 px-4">
          <label className="input input-bordered flex items-center">
            Grant
            <input 
              type="number" 
              className="grow mx-2 text-right" 
              placeholder="123"  
              min={0} 
              value={clientDream.grant}
              name="grant"
              onChange={updateClientDream}
            />
            €
          </label>
          <label className="input input-bordered flex grow items-center">
            DreamerSecret
            <input type="text" className="text grow rounded-r-none text-right" placeholder="7gtcz9nvb47olbzq" name="dreamerSecret" value={clientDream.dreamerSecret || ''} onChange={updateClientDream}  />
          </label>
          </span>
          <div className="px-4 py-2">
          <label className="input input-bordered flex grow items-center">
            Kommentar
            <input type="text" className="ml-2 text grow rounded-r-none" placeholder="Danke für deinen Dream." name="comment" value={clientDream.comment || ''} onChange={updateClientDream}  />
          </label>
          </div>
          <div className="flex w-full">
            <button onClick={() => updateDream('OPEN')} className={`btn rounded-none border-none text-white ${getDreamColor('OPEN')} bg-opacity-40 p-3 grow ${dream.grantStatus === 'OPEN' ? 'font-bold bg-opacity-90' : ''}`}>Open</button>
            <button onClick={() => updateDream('PLANNED')} className={`btn rounded-none border-none text-white ${getDreamColor('PLANNED')} bg-opacity-40 p-3 grow ${dream.grantStatus === 'PLANNED' ? 'font-bold bg-opacity-90' : ''}`}>Plan</button>
            <button onClick={() => updateDream('CANCELED')} className={`btn rounded-none border-none text-white ${getDreamColor('CANCELED')} bg-opacity-40 p-3 grow ${dream.grantStatus === 'CANCELED' ? 'font-bold bg-opacity-90' : ''}`}>Cancel</button>
            <button onClick={() => updateDream('ACCEPTED')} className={`btn rounded-none border-none text-white ${getDreamColor('ACCEPTED')} bg-opacity-40 p-3 grow ${dream.grantStatus === 'ACCEPTED' ? 'font-bold bg-opacity-90' : ''}`}>Accept</button>
          </div>
      </div>
    </>
  )
}