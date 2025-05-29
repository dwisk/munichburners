'use client';

import { Dream, DreamYear } from 'munichburners/lib/dreams/schema';
import { useEffect, useState } from 'react';
import { parse } from 'csv-parse/sync';
import { useRouter } from 'next/navigation';

type CSVRecord = {
  [key: string]: string;

}

// Item = Dream & CSVRecord;
type Item = {
  record: CSVRecord;
  dream?: Dream;
  status: 'NEW' | 'UPDATED' | 'EXISTING';
};

const mapping = {
  name: 'Name deines Traums / Name of your Dream',
  dreamer: 'Dein Name / Your Name',
  email: 'E-Mail-Adresse',
  timestamp: 'Zeitstempel',
  CSVid: 'Id',
  shortDescription: 'Kurz-Beschreibung / Short Description',
  budgetNeed: 'Brauchst du finanzielle Unterstützung? / Do you need monetary support?',
  requestMin: 'Min',
  requestMinReason: 'Wieviel € würdest du mindestens benötigen? / How much € would you need at least?',
  requestMax: 'Max',
  requestMaxReason: 'Wieviel € wären ideal für deinen Traum? / How much € would be ideal for your dream?',
  dreamType: 'Art deines Traums / What kind of dream?',
}

export default function CSVdreams({dreamYear, userSecret}: {dreamYear: DreamYear, userSecret:string}) {
  const [CSV, setCSV] = useState<string>('');
  const [CSVdreams, setCSVdreams] = useState<(Item)[]>([]);
  const router = useRouter();

  const dreams = dreamYear.dreams;


  useEffect(() => {
    const records = parse(CSV, {
      columns: true,
      skip_empty_lines: true
    });
    const recordDreams = records.map((record: CSVRecord) => {
      const item:Item = {
        record,
        status: 'NEW',
      }
      const dream = dreams.find((d) => {
        return d.CSVid === parseInt(record['Id']) && d.email === record[mapping.email];
      }
      );
      if (!!dream?.documentId) { 
        item.status = 'EXISTING';
        item.dream = dream;
      }

      if (dream && dream.timestamp !== record[mapping.timestamp]) {
        item.status = 'UPDATED';
      }

      if (dream && dream.requestMinReason !== record[mapping.requestMinReason]) {
        item.status = 'UPDATED';
      }
      if (dream && dream.requestMaxReason !== record[mapping.requestMaxReason]) {
        item.status = 'UPDATED';
      }
      
      return item;
    });


    setCSVdreams(recordDreams);    
  }, [CSV, dreams]);

  const addDream = async (record:CSVRecord) => {
    const dream = convertToDream(record);
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
  const updateDream = async (dream:Dream | undefined, record:CSVRecord) => {
    if (!dream) return;
    const newDream = convertToDream(record);
    await fetch(`/api/dreams/${dream.documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: newDream,
        userSecret
      }),
    })
    await fetch('/api/revalidate?tag=root');
    router.refresh();
  }

  const convertToDream = (record: CSVRecord): Dream => {
    let budgetNeed:'NONE' | 'MUST' | 'NICE';
    switch (record[mapping.budgetNeed]) {
      case "Ja, sonst klappt's nicht / Yes, without I cannot realize it":
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
    switch (record[mapping.dreamType]) {
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
      CSVid: parseInt(record['Id']),
      name: record[mapping.name],
      budgetNeed,
      requestMin: parseInt(record['Min']) || 0,
      requestMinReason: record[mapping.requestMinReason],
      requestMax: parseInt(record['Min']) || 0,
      requestMaxReason: record[mapping.requestMaxReason],
      grant: 0,
      dream_year: dreamYear.documentId,
      grantStatus: 'OPEN',
      shortDescription: record[mapping.shortDescription],
      dreamer: record[mapping.dreamer],
      dreamType,
      timestamp: record[mapping.timestamp],
      email: record[mapping.email],
    };
    return dream;
  }

  return (
    <>
      <textarea value={CSV} onChange={(e) => setCSV(e.target.value)} className="w-full h-96 text-black" />
      <table className="table-auto table-xs w-full">
        <tbody>
          {CSVdreams
          .filter((item) => item.status !== 'EXISTING')
          .map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.dream?.CSVid} {item.status} {(item.record as CSVRecord)['Id']} </td>
              {item.status === 'EXISTING' && item.dream && (
                <>
                  <td className="px-4 py-2">{item.dream.name}</td>
                  <td className="px-4 py-2">{item.dream.dreamer}</td>
                  <td></td>
                </>
              )}
              {item.status === 'UPDATED' && item.dream && (
                <>
                  <td className="px-4 py-2">{item.record[mapping.name]}</td>
                  <td className="px-4 py-2">
                    {item.dream.name} &raquo; {item.record[mapping.name]}<br />
                    {item.dream.dreamer} &raquo; {item.record[mapping.dreamer]}<br />
                    {item.record[mapping.shortDescription]} &raquo; {item.dream.shortDescription}<br />
                    {item.record[mapping.timestamp]} &raquo; {item.dream.timestamp}<br />
                    {item.record[mapping.email]} &raquo; {item.dream.email}<br />


                  </td>
                  <td>
                    <button className="btn btn-xs" onClick={() => {
                      updateDream(item.dream, item.record);
                    }}>update</button> 
                  </td>
                </>
              )}
              {item.status === 'NEW' && (
                <>
                  <td className="px-4 py-2">{item.record[mapping.name]}</td>
                  <td className="px-4 py-2">{item.record[mapping.dreamer]}</td>
                  <td>
                    <button className="btn btn-xs btn-neutral" onClick={() => {
                      addDream(item.record);
                    }}>add</button> 
                  </td>
                </>
              )}
              {/* 
              <td className="px-4 py-2">{item.name ||  (item as CSVRecord)['Name deines Traums / Name of your Dream']}</td>
              <td className="px-4 py-2">{item.timestamp } | {(item as CSVRecord)['Zeitstempel']}</td>
              <td className="px-4 py-2">{item.email ||  (item as CSVRecord)['E-Mail-Adresse']}</td>
               */}

            </tr>
          ))}
        </tbody>
      </table>
 
        
    </>
  )
}