import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import { databaseId } from "../index.js";
import ActivityMeta from "../../components/ActivityMeta";
import NotionPage from "../../components/Blocks";
import Text from "../../components/Text";
import { usePage } from "../../lib/_clienthelpers";
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useLanguage } from "../../lib/LanguageContext";
import { useEffect } from "react";


export default function Activity({ publicPage, blocks }) {
  // return <pre>{JSON.stringify(page, null, 2)}</pre>

  const [codeword, setcodeword] = useState('');

  const { page } = usePage(publicPage, codeword);
  
  if (!page || !blocks) {
    return <div />;
  }

  const langs = [
    { title: "DE"},
    { title: "EN"}
  ];
  const { language, setLanguage } = useLanguage();
  useEffect(() => {
    setLanguage(language)
  }, [language])

  // refreshPage if notion data is older than 1h, aws-image links expire
  const router = useRouter();
  const cacheAge = Math.floor((new Date() - new Date(page.lastFetch)) / 1000) ;
  if (cacheAge > 3600)  router.replace(router.asPath);

  return (
    <div className="container mx-auto">
      <Head>
        <title>{page.properties.Name.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {langs.filter(l => l.title !== language).map(l => (
          <button key={l.title} className="ml-2 font-bold fixed top-0 right-0 px-4 rounded-bl-xl z-50 bg-white bg-opacity-20 shadow-md backdrop-blur-sm p-2" onClick={() => setLanguage(l.title)}>{l.title}</button> 
      ))}

      <article>
        <h1 className="h1">
          <Text text={page.properties.Name.title} />
        </h1>

        <section className="panel content">
          <ActivityMeta post={page} />
          {blocks.length === 0 && page.properties.Description && (
            <p className="mb-4">
              <Text text={page.properties.Description.rich_text} />
            </p>
          )}
          <NotionPage blocks={blocks} />
        </section>
      </article>
      <p className="px-4 md:px-0 ">
        <Link href="/" className="link">
          ← Startseite
        </Link>
        <a href={`/api/activities/${page.id}.ics`} className="link float-right">Kalender ↓</a>
      </p>
      {page.properties.Secret ? (
        <section className="panel">
          <Text text={page.properties.Secret?.rich_text} />
        </section>      
      ) : (
        <section className="panel flex">
          Privat:{' '}<input type="text" className="w-full bg-transparent ml-4 text-white" value={codeword} onChange={(e) => setcodeword(e.currentTarget.value)} />
        </section>
      )}
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id, true, false);


  return {
    props: {
      publicPage: page,
      blocks,
    },
    revalidate: 120,
  };
};
