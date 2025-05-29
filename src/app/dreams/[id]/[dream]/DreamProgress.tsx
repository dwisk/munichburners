import { Dream } from "munichburners/lib/dreams/schema";

export default function DreamProgress({dream}:{dream: Dream}) {
  const statusNum = ['OPEN', 'DENIED', 'ACCEPTED', 'INVOICES', 'READY', 'PAID'].indexOf(dream.grantStatus);
  return (
    <ul className="steps w-full steps-vertical md:steps-horizontal">
      <li className={`step ${statusNum >= 0 ? 'step-neutral' : ''}`}>Dream</li>
      
      <li className={`step ${statusNum >= 2 ? 'step-neutral' : ''}`}>Geld freigegeben</li>
      <li className={`step ${statusNum >= 3 ? 'step-neutral' : ''}`}>Rechnungen</li>
      <li className={`step ${statusNum >= 4 ? 'step-neutral' : ''}`}>Bereit</li>
      <li className={`step ${statusNum >= 5 ? 'step-neutral' : ''}`}>Ausgezahlt</li>
    </ul>
  );
}