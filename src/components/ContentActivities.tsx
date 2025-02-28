import { getActivities } from "munichburners/lib/activities";
import { ContentActivities } from "munichburners/lib/content/schema";
import Link from "next/link";
import ActivityMeta from "./ActivityMeta";
import ReactMarkdown from "react-markdown";

export default async function ContentActivitiesList({ content }: { content: ContentActivities }) {
      const activities = await getActivities();
    
  return (<>

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
                {activity.shortDescription && (
                  <div className="mb-4">
                    <ReactMarkdown>{activity.shortDescription}</ReactMarkdown>
                  </div>
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
        </>
  );
}