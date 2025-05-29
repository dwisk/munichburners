import { Dream } from "munichburners/lib/dreams/schema";

export default function DreamProgress({dream}:{dream: Dream}) {
  const statusNum = ['OPEN', 'DENIED', 'ACCEPTED', 'INVOICES', 'READY', 'PAID'].indexOf(dream.grantStatus || '');
  return (
    <ul className="steps w-full steps-vertical md:steps-horizontal">
      <li data-content="🌈" className={`leading-snug step ${statusNum >= 0 ? 'step-neutral' : ''}`}>Neuer Dream eingereicht</li>
      {statusNum === 1 ? (
        <li data-content="❌" className={`leading-snug step step-neutral`}>Keine Finanzierung</li>
      ) : (<>
        <li data-content="✅" className={`leading-snug step ${statusNum >= 2 ? 'step-neutral' : ''}`}>Geld ist freigegeben</li>
      <li data-content="🧾" className={`leading-snug step ${statusNum >= 3 ? 'step-neutral' : ''}`}>Rechnungen eingereicht</li>
      <li data-content="⏳" className={`leading-snug step ${statusNum >= 4 ? 'step-neutral' : ''}`}>Bereit für Überweisung</li>
      <li data-content="💶" className={`leading-snug step ${statusNum >= 5 ? 'step-neutral' : ''}`}>Geld ist ausgezahlt</li>
      </>)}
    </ul>
  );
}