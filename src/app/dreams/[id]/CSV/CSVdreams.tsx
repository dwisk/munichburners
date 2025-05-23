'use client';

import { Dream, DreamYear } from 'munichburners/lib/dreams/schema';
import { useEffect, useState } from 'react';
import { parse } from 'csv-parse/sync';
import { useRouter } from 'next/navigation';

type CSVRecord = {
  [key: string]: string;

}

export default function CSVdreams({dreamYear}: {dreamYear: DreamYear}) {
  const [CSV, setCSV] = useState<string>('');
  const [CSVdreams, setCSVdreams] = useState<(Dream | CSVRecord)[]>([]);
  const router = useRouter();

  const dreams = dreamYear.dreams;


  useEffect(() => {
    const records = parse(CSV, {
      columns: true,
      skip_empty_lines: true
    });
    const recordDreams = records.map((record: CSVRecord) => {
      const dream = dreams.find((d) => {
        return d.timestamp === record['Zeitstempel'] && d.email === record['E-Mail-Adresse'];
      }
      );
      return dream || record;
    });


    setCSVdreams(recordDreams);    
  }, [CSV, dreams]);

  const addDream = async (record:CSVRecord) => {
    let budgetNeed:'NONE' | 'MUST' | 'NICE';
    switch (record['Brauchst du finanzielle Unterstützung? / Do you need monetary support?']) {
      case 'Ja, ich brauche finanzielle Unterstützung. / Yes, I need monetary support.':
        budgetNeed = 'MUST';
        break;
      case 'Wäre cool, geht aber auch so / Would be great, but also fine without':
        budgetNeed = 'NICE';
        break;
      default:
        budgetNeed = 'NONE';
        break;        
    }

    let dreamType: 'ART' | 'ROOM' | 'WORKSHOP' | 'OTHER';
    switch (record['Was ist dein Traum? / What is your dream?']) {
      case 'Kunstprojekt':
        dreamType = 'ART';
        break;
      case 'Raum Takeover (Deko & more)':
        dreamType = 'ROOM';
        break;
      case 'Workshop':
        dreamType = 'WORKSHOP';
        break;
      default:
        dreamType = 'OTHER';
        break;        
    }

    const dream:Dream = {
      name: record['Name deines Traums / Name of your Dream'],
      budgetNeed,
      requestMin: parseInt(record['Min']) || 0,
      requestMax: parseInt(record['Min']) || 0,
      grant: 0,
      dream_year: dreamYear.documentId,
      grantStatus: 'OPEN',
      shortDescription: record['Kurz-Beschreibung / Short Description'],
      dreamer: record['Dein Name / Your Name'],
      dreamType,
      timestamp: record['Zeitstempel'],
      email: record['E-Mail-Adresse'],
    };

    await fetch('/api/dreams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dream),
    })
    await fetch('/api/revalidate?tag=root');
    router.refresh();



  }

  return (
    <>
      <textarea value={CSV} onChange={(e) => setCSV(e.target.value)} className="w-full h-96 text-black" />
      <table className="table-auto table-xs w-full">
        <tbody>
          {CSVdreams.filter((record) => !record.documentId).map((record, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{record.name ||  (record as CSVRecord)['Name deines Traums / Name of your Dream']}</td>
              <td className="px-4 py-2">{record.timestamp ||  (record as CSVRecord)['Zeitstempel']}</td>
              <td className="px-4 py-2">{record.email ||  (record as CSVRecord)['E-Mail-Adresse']}</td>
              <td className="px-4 py-2">{record.documentId ? 'found' : (
                <button className="btn btn-xs btn-neutral" onClick={() => {
                  addDream(record as CSVRecord);
                }}>add</button>
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
 
        
    </>
  )
}