import { getActivities } from "../lib/activities";
import Link from "next/link";
import ActivityMeta from "munichburners/components/ActivityMeta";
import ReactMarkdown from "react-markdown";

export async function generateMetadata() {
  return {
    title: "Munich Burners",
    openGraph: {
      description: `Find local burners in Munich`,
      images: [`/api/og`],
    }
}
}

export default async function Home() {
  const activities = await getActivities();

  return (
    <div className="container mx-auto">
      <main className="">
        <header className="mt-10 mb-10">
          <div className="max-w-xs mx-auto mb-6">
            <img className="mx-auto" src="./signet.svg" />
          </div>
          <h1 className="text-center text-6xl font-title">
          Munich Burners
          </h1>
        </header>
        
        
        <h2 className="h2 text-center leading-5 mt-10 font-bold">Munich Micro Burn 2025</h2>
        <div className="text-center uppercase text-xs font-bold mt-2">let's burn together</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mx-5 my-5 font-title font-bold">
          <div className="gridpanel h2 p-5 leading-8">Community<br/>Gathering</div>
          <div className="gridpanel h2 p-5 leading-5">05.06.2025<br/>-<br/>09.06.2025</div>
          <div className="gridpanel h2 p-5 leading-8">South of<br/>Munich</div>
        </div>

        <h2 className="h2 text-center leading-5 mt-10 font-bold pb-0">Community Places</h2>
        <div className="text-center uppercase text-xs font-bold mt-2">get connected online</div>
        
        <div className="panel">
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <li className="link text-center"><a href="http://discord.munichburners.de" target="_blank">DISCORD</a> </li>
            <li className="link text-center"><a href="http://fb.munichburners.de" target="_blank">FACEBOOK</a> </li>
            <li className="link text-center"><a href="http://telegram.munichburners.de" target="_blank">TELEGRAM</a> </li>
            <li className="link text-center"><a href="http://signal.munichburners.de" target="_blank">SIGNAL</a> </li>
            <li className="link text-center line-through">WHATSAPP </li>
          </ul>
        </div>

        <h2 className="h2 text-center leading-5 mt-10 font-bold pb-0">Burner Activities</h2>
        <div className="text-center uppercase text-xs font-bold mt-2">meet for real</div>
        <ol className="">
          {activities.filter(activity => new Date(activity.startDate.substr(0, 10)) > new Date(new Date().setHours(0, 0, 0, 0)) )
                .sort((a,b) => a.startDate > b.startDate ? 1 : -1)
                .map((activity) => {
            
            return (
              <li key={activity.id} className="panel">
                <h3 className="link">
                  <Link href={`/activities/${activity.documentId}`}>
                    {activity.name}
                  </Link>
                </h3>

                <ActivityMeta activity={activity} />
                {activity.description && (
                  <p className="mb-4">
                    <ReactMarkdown>{activity.shortDescription}</ReactMarkdown>
                  </p>
                )}
                <p className="text-right">
                <Link href={`/activities/${activity.documentId}`} className="font-black">
                   Mehr lesen →
                </Link>
                </p>
              </li>
            );
          })}
        </ol>
        <p className="px-4 md:px-0 pb-4 text-center">
          <a href="/api/activities.ics" className="link">In Kalender importieren ↓</a>
        </p>
      </main>
    </div>
  );
}

