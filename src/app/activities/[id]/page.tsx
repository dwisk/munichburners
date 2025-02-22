import Link from "next/link";
// import { useLanguage } from "../../lib/LanguageContext";
// import { useEffect } from "react";
import { getActivity } from "munichburners/lib/activities";
import ActivityMeta from "munichburners/components/ActivityMeta";
import ReactMarkdown from "react-markdown";

type PageProps = {
  params: {
    id: string;
  }
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

//   const langs = [
//     { title: "DE"},
//     { title: "EN"}
//   ];
//   const { language, setLanguage } = useLanguage();
//   useEffect(() => {
//     setLanguage(language)
//   }, [language])

  return (
    <div className="container mx-auto">
      {/* {langs.filter(l => l.title !== language).map(l => (
          <button key={l.title} className="ml-2 font-bold fixed top-0 right-0 px-4 rounded-bl-xl z-50 bg-white bg-opacity-20 shadow-md backdrop-blur-sm p-2" onClick={() => setLanguage(l.title)}>{l.title}</button> 
      ))} */}

      <article>
        <h1 className="h1">
          {activity.name}
        </h1>

        <section className="panel content">
          <ActivityMeta activity={activity} />
          <ReactMarkdown>{activity.description}</ReactMarkdown>
        </section>
      </article>
      <p className="px-4 md:px-0 ">
        <Link href="/" className="link">
          ← Startseite
        </Link>
      </p>
    </div>
  );
}
