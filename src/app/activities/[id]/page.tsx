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

  return {
    title: `Munich Burners - ${activity.name}`,
    openGraph: {
      title: `Munich Burners - ${activity.name}`,
      description: `${activity.shortDescription}`,
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
