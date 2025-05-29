import { Dream, DreamYear } from "munichburners/lib/dreams/schema";
import Link from "next/link";
import { UsageBar } from "./DreamUsage";
import { getDreamRights, hasDreamYearRights } from "munichburners/lib/dreams";

export default function DreamCard({ dream, dreamYear, userSecret }: { dream: Dream, dreamYear:DreamYear, userSecret:string }) {
  const dreamYearRights = hasDreamYearRights(dreamYear, userSecret);
  const dreamRights = getDreamRights(dream, userSecret);
  return (
    <div key={dream.id} className="card relative gridpanel mb-4 rounded-lg">
          <div className="p-4">
          {dreamRights.isDreamer && (
          <Link href={`/dreams/${dreamYear.slug}/${dream.documentId}`} className="absolute top-0 right-0 p-2 text-right text-xs bg-black bg-opacity-20 rounded-bl-lg">
            DEIN<br />DREAM
          </Link>
          )}
          {dreamYearRights && dream.budgetNeed !== 'NONE' && (
          <Link href={`/dreams/${dreamYear.slug}/${dream.documentId}`} className="absolute top-0 right-0 p-2 text-right text-xs bg-black bg-opacity-20 rounded-bl-lg">
            REALIZE<br />DREAM
          </Link>
          )}
          <h2 className="text-2xl font-bold">
            {dream.name}
          </h2>
          <p>
            <span className="font-bold">{dream.dreamType}</span> <span className="italic">by {dream.dreamer}</span>:<br />{dream.shortDescription}
          </p>

          {dream.budgetNeed !== 'NONE' && (
            <UsageBar max={dreamYear.budget} className="mt-4" usages={[
              { value: dream.requestMin || 0, color: "bg-white bg-opacity-60", label: 'min' },
              { value: (dream.requestMax || 0) - (dream.requestMin || 0), color: "bg-white bg-opacity-30", label: 'max' },
            ]} />
          )}
          </div>

          <div className="w-full bg-black bg-opacity-20 flex justify-items-stretch gap-px leading-5">
            {dream.budgetNeed !== 'NONE' && (<>
              <div className={`bg-black p-3 flex items-center ${dream.budgetNeed === 'MUST' ? '' : 'bg-opacity-30'}`}>{dream.budgetNeed}</div>
            </>)}
            {dream.budgetNeed !== 'NONE' && (<div className="bg-black bg-opacity-60 grow p-3 text-center">
              {dream.requestMin}€ min
            </div>)}
            {dream.budgetNeed !== 'NONE' && (<div className="bg-black bg-opacity-60 grow p-3 text-center">
              {dream.requestMax}€ max
            </div>)}
            {['ACCEPTED','INVOICES','READY','PAID'].includes(dream.grantStatus) && (
              <div className={`bg-green-800 bg-opacity-60 font-bold p-3 text-right`}>{dream.grant}€ granted</div>
            )}
            {dream.budgetNeed !== 'NONE' && ['OPEN'].includes(dream.grantStatus) && (
              <div className={`bg-blue-800 bg-opacity-60 font-bold p-3 text-right`}>OPEN</div>
            )}
            {dream.budgetNeed !== 'NONE' && ['DENIED'].includes(dream.grantStatus) && (
              <div className={`bg-red-800 bg-opacity-60 font-bold p-3 text-right`}>DENIED</div>
            )}
          </div>
          
        </div>
  );
}