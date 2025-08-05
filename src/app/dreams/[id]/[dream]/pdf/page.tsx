import DreamCard from "munichburners/app/dreams/_components/DreamCard";
import DreamProgress from "munichburners/app/dreams/_components/DreamProgress";
import DreamReceipt from "munichburners/app/dreams/_components/DreamReceipt";
import MMBLogin from "munichburners/components/MMBLogin";
import { getDream, getDreamRights } from "munichburners/lib/dreams";
import { DreamYear } from "munichburners/lib/dreams/schema";
import { getSession } from "munichburners/lib/auth";
import Link from "next/link";


type PageProps = {
  params: Promise<{
    dream: string;
    id: string;
  }>;
};

export default async function Page(props:PageProps) { 
  const session = await getSession();
  const { dream: dreamId, id: dreamYear } = await props.params;

  const dream = await getDream(dreamId);

  if (!dream) {
    return <>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-center">Dream leider nicht gefunden.<br/>
        <Link href={`/dreams/${dreamYear}`} className="btn btn-outline mt-4">Zurück zu den {dreamYear} Dreams</Link>
      </p>
    </>;
  }

  if (!session) {
    return <>
    <div className="container mx-auto px-4 md:px-0 mb-10">
      <h1 className="text-4xl font-bold">Dream</h1>
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
      <DreamCard key={dream.id} dream={dream} dreamYear={dream.dream_year as DreamYear} userSecret={''} />
      {dream.budgetNeed !== 'NONE' && (<>
        <h1 className="text-3xl">Dream Status</h1>
        <DreamProgress dream={dream} />
        <h1 className="text-3xl">Geld bekommen</h1>
        <p className="mb-4  text-center font-bold">Bitte einloggen um Details zu sehen und Geld zu bekommen.</p>
        <p className="mb-4  text-center"><MMBLogin /></p>
      </>)}
      
    </div>
    </>;
  }

    const dreamRights = getDreamRights(dream, session.user?.email || '');
  
    if (!dreamRights.isYearRealizer) {
      return <div>Realizer only</div>;
    }

  return (
    <div className="max-w-4xl mx-auto ">
      <h1 className="text-4xl">Dream PDF</h1>
      <DreamCard key={dream.id} dream={dream} dreamYear={dream.dream_year as DreamYear} userSecret={''} />
      <div className="flex flex-col gap-4">
        <DreamReceipt dream={dream} />
        <Link className="btn btn-lg btn-neutral grow" href={`/api/dreams/${dream.documentId}/zip`}>Einzelbelege als .zip</Link>
      </div>
    </div>
  )
}