import Head from "next/head";
import Link from "next/link";
// import { useLanguage } from "../../lib/LanguageContext";
// import { useEffect } from "react";
import { getActivity } from "munichburners/lib/activities";
import ActivityMeta from "munichburners/components/ActivityMeta";
import ReactMarkdown from "react-markdown";


export default async function Activity({ id }:{id:string}) {
  // return <pre>{JSON.stringify(page, null, 2)}</pre>

  const activity = await getActivity(id);
  
  if (!activity) {
    return null;
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
      <Head>
        <title>{activity.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content={`https://munichburners.de/api/og?title=${activity.name}`}
        />
      </Head>

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
        {/* <a href={`/api/activities/${activity.documentId}.ics`} className="link float-right">Kalender ↓</a> */}
      </p>
    </div>
  );
}
