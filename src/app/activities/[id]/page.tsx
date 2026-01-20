import { getActivity } from "munichburners/lib/activities";
import ActivityDetails from "munichburners/components/ActivityDetails";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props:PageProps) {
  const params = await props.params;
  const activity = await getActivity(params.id);
  if (!activity) {
    return {
      title: "Munich Burners",
      openGraph: {
        description: `Find local burners in Munich`,
        images: [`/api/og`],
      }
    }
  }

  const locale = 'de-DE';
  const date = new Date(activity.startDate).toLocaleString(
        locale,
        activity.startDate.length > 10 ? {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: 'Europe/Berlin'
        } : {
          month: "long",
          day: "2-digit",
          year: "numeric",
          timeZone: 'Europe/Berlin'
        }
      );

    let enddate:string|boolean = false;
    if (activity.endDate && activity.startDate.length > 10) {
      enddate = new Date(activity.endDate).toLocaleString(
        locale,
        activity.endDate && activity.startDate.substr(0,10) === activity.endDate.substr(0,10) ? {
          hour: "2-digit",
          minute: "2-digit"
        } : {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: 'Europe/Berlin'
        });
    } else if (activity.endDate) {
      enddate = new Date(activity.endDate).toLocaleString(
        locale,
        {
          month: "long",
          day: "2-digit",
          year: "numeric",
          timeZone: 'Europe/Berlin'
        });
    }

  return {
    title: `Munich Burners - ${activity.name}`,
    openGraph: {
      title: `Munich Burners - ${activity.name}`,
      description: `${activity.shortDescription || `${date}${enddate ? ` - ${enddate}` : ''} @ ${activity.location || 't.b.d.'}`}`,
      images: [`/api/og?title=${activity.name}`],
    }
  }
}

export default async function Activity(props:PageProps) {
  const params = await props.params;
  const activity = await getActivity(params.id);
  
  if (!activity) {
    return <div>Activity {params.id} not found</div>;
  }

  return (<ActivityDetails activity={activity} />);
}
