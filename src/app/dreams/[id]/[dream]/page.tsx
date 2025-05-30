import DreamCard from "munichburners/app/dreams/_components/DreamCard";
import MMBLogin from "munichburners/components/MMBLogin";
import { getSession } from "munichburners/lib/auth";
import { getDream, getDreamRights } from "munichburners/lib/dreams";
import { DreamYear } from "munichburners/lib/dreams/schema";
import Image from "next/image";
import DreamRelease from "../../_components/DreamRelease";
import DreamUpload from "../../_components/DreamUpload";
import DreamReview from "../../_components/DreamReview";
import DreamProgress from "../../_components/DreamProgress";

type PageProps = {
  params: Promise<{
    dream: string;
  }>;
};


export default async function Page(props:PageProps) { 
  const session = await getSession();
  const { dream: dreamId } = await props.params;

  const dream = await getDream(dreamId);

  if (!session) {
    return <>
    <div className="container mx-auto px-4 md:px-0 mb-10">
      <h1 className="text-4xl font-bold">Dream</h1>
      <DreamCard key={dream.id} dream={dream} dreamYear={dream.dream_year as DreamYear} userSecret={''} />
      <h1 className="text-3xl">Dream Status</h1>
      <DreamProgress dream={dream} />
      <h1 className="text-3xl">Geld bekommen</h1>
      <p className="mb-4  text-center font-bold">Bitte einloggen um Details zu sehen und Geld zu bekommen.</p>
      <p className="mb-4  text-center"><MMBLogin /></p>
      
    </div>
    </>;
  }

  if (!dream) {
    return <div>Dream not found</div>;
  }

  const dreamRights = getDreamRights(dream, session.user?.email || '');

  if (!dreamRights.isDreamer && !dreamRights.isYearRealizer) {
    return <div>Das ist nicht dein Dream. Falls doch, frag Mephy</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-0 mb-10">
      <h1 className="text-4xl">Dream Details</h1>
      <DreamCard key={dream.id} dream={dream} dreamYear={dream.dream_year as DreamYear} userSecret={''} />
      {dream.comment && (
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image
                alt="Munich Burners"
                width={40}
                height={40}
                src="/icon-vorstand.png" />
            </div>
          </div>
          <div className="chat-bubble">{dream.comment}</div>
        </div>
      )}

      <h1 className="text-3xl">Dream Status</h1>
      <DreamProgress dream={dream} />

      {dreamRights.isYearRealizer && (
        <DreamRelease dream={dream} userSecret={session.user?.email || ''} />
      )}

      {dreamRights.isDreamer && ['ACCEPTED', 'INVOICES', 'READY', 'PAID'].includes(dream.grantStatus || '') && (<>
        <DreamUpload dream={dream} userSecret={session.user?.email || ''} />
      </>)}

      {dreamRights.isYearRealizer && ['ACCEPTED', 'INVOICES', 'READY', 'PAID'].includes(dream.grantStatus || '') && (<>
        <DreamReview dream={dream} userSecret={session.user?.email || ''} />
      </>)}
    </div>
  );
}