import { UsageBar } from "munichburners/app/dreams/[id]/page";
import { Dream, DreamYear } from "munichburners/lib/dreams/schema";
import { Session } from "next-auth";
import Link from "next/link";

export default function DreamCard({ dream, dreamYear, session }: { dream: Dream, dreamYear:DreamYear, session:Session|null }) {
  return (
    <div key={dream.id} className="card relative gridpanel mb-4 rounded-lg">
          <div className="p-4">
          {dream.dreamerSecret === session?.user?.email && (
          <Link href={`/dreams/${dreamYear.slug}/${dream.id}`} className="absolute top-0 right-0 p-2 text-right text-xs bg-black bg-opacity-20 rounded-bl-lg">
            DEIN<br />DREAM
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
              { value: dream.requestMin, color: "bg-white bg-opacity-60", label: 'min' },
              { value: dream.requestMax - dream.requestMin, color: "bg-white bg-opacity-30", label: 'max' },
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
            {['ACCEPTED','INVOICE','PAID'].includes(dream.grantStatus) && (
              <div className={`bg-green-800 bg-opacity-60 font-bold p-3 text-right`}>{dream.grant}€ granted</div>
            )}
            {dream.budgetNeed !== 'NONE' && ['OPEN'].includes(dream.grantStatus) && (
              <div className={`bg-blue-800 bg-opacity-60 font-bold p-3 text-right`}>OPEN</div>
            )}
            {dream.budgetNeed !== 'NONE' && ['DENIED'].includes(dream.grantStatus) && (
              <div className={`bg-red-800-800 bg-opacity-60 font-bold p-3 text-right`}>DENIED</div>
            )}
          </div>
          
        </div>
  );
}