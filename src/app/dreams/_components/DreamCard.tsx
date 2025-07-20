import { Dream, DreamYear } from "munichburners/lib/dreams/schema";
import Link from "next/link";
import { UsageBar } from "./DreamUsage";
import { getDreamColor, getDreamEmoji, getDreamLabel, hasDreamYearRights } from "munichburners/lib/dreams";

export default function DreamCard({ dream, dreamYear, userSecret }: { dream: Dream, dreamYear:DreamYear, userSecret:string }) {
  const dreamYearRights = hasDreamYearRights(dreamYear, userSecret);

  const dreamStatusColor = getDreamColor(dream.grantStatus) || 'bg-black';

  const invoiceSum = Math.round((dream.invoices?.reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0)*100)/100;

  return (
    <Link href={`/dreams/${dreamYear.slug}/${dream.documentId}`} className="card relative gridpanel mb-4 rounded-lg">
          <div className="p-4">
          {dreamYearRights && dream.budgetNeed !== 'NONE' && (
          <div className={`absolute top-0 right-0 p-2 text-right text-xs ${dreamStatusColor} bg-opacity-60 rounded-bl-lg`}>
            DREAM<br /><span className="font-bold">{dream.grantStatus || 'OPEN'}</span>
          </div>
          )}
          <h2 className="text-2xl font-bold">
            {dream.name}
          </h2>
          <p>
            <span className="font-bold">{dream.dreamType}</span> <span className="italic">by {dream.dreamer}</span>:<br />{dream.shortDescription}
          </p>

          {/* {dream.budgetNeed !== 'NONE' && (
            <UsageBar max={dreamYear.budget} className="mt-4" usages={[
              { value: dream.requestMin || 0, color: "bg-white bg-opacity-60", label: 'min' },
              { value: (dream.requestMax || 0) - (dream.requestMin || 0), color: "bg-white bg-opacity-30", label: 'max' },
            ]} />
          )} */}
          {['INVOICES','READY','PAID'].includes(dream.grantStatus || '') && (
            <UsageBar max={dream.grant || 0} showMax className="mt-4 mb-6" usages={[
              { value: invoiceSum || 0, color: `${getDreamColor(dream.grantStatus)} bg-opacity-60`, label: 'invoices' },
            ]} />            
          )}
          </div>

          <div className="w-full bg-black bg-opacity-20 flex justify-items-stretch gap-px leading-5">
            {dream.budgetNeed !== 'NONE' && (<>
              <div className={`bg-black p-3 flex items-center ${dream.budgetNeed === 'MUST' ? '' : 'bg-opacity-30'}`}>{dream.budgetNeed}</div>
            </>)}
            {dream.budgetNeed !== 'NONE' && (<div className="bg-black bg-opacity-60 grow p-3 flex items-center justify-center">
              {dream.requestMin}€ min
            </div>)}
            {dream.budgetNeed !== 'NONE' && (<div className="bg-black bg-opacity-60 grow p-3 flex items-center justify-center">
              {dream.requestMax}€ max
            </div>)}
            {['PLANNED', 'ACCEPTED'].includes(dream.grantStatus || '') && (
              <div className={`${getDreamColor(dream.grantStatus)} bg-opacity-80 font-bold p-3 text-right`}>{getDreamEmoji(dream.grantStatus)} {dream.grant}€ {getDreamLabel(dream.grantStatus)}</div>
            )}
            {['INVOICES','READY','PAID'].includes(dream.grantStatus || '') && (
              <div className={`${getDreamColor(dream.grantStatus)} bg-opacity-80 font-bold p-3 text-right leading-tight`}>{getDreamEmoji(dream.grantStatus)} {invoiceSum}€ {getDreamLabel(dream.grantStatus)}<br/><small className="font-normal">von geplant {dream.grant}€</small></div>
            )}
            {dream.budgetNeed !== 'NONE' && ['OPEN', 'CANCELED'].includes(dream.grantStatus || '') && (
              <div className={`${getDreamColor(dream.grantStatus)} bg-opacity-80 font-bold p-3 text-right`}>{getDreamEmoji(dream.grantStatus)} {getDreamLabel(dream.grantStatus)}</div>
            )}
          </div>
          
        </Link>
  );
}