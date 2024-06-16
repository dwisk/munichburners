import Head from "next/head";
import { getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import Blocks from "../../components/Blocks";
import Text from "../../components/Text";
import { useRouter } from "next/dist/client/router";
import { revalidatePage } from "../../lib/_clienthelpers";
import { useLanguage } from "../../lib/LanguageContext";
import { useEffect } from "react";


export default function Page({ page, blocks, parent, onepager }) {
  if (!page || !blocks) {
    return <div />;
  }

  // refreshPage if notion data is older than 1h, aws-image links expire
  const router = useRouter();
  const cacheAge = Math.floor((new Date() - new Date(page.lastFetch)) / 1000) ;

  const refresh = async () => {
    await revalidatePage(page.id);
    console.info("refresh projects cache", cacheAge);
    router.replace(router.asPath, router.asPath, { scroll: false }); // soft refresh
  };

  if (cacheAge > 3600) refresh();

  const showSignet = onepager || page.icon?.emoji === "🔥";
  const hideBack = page.icon?.emoji === "🛡️";
  const hasCover = page.cover?.file?.url;

  const reval = (e) => {
    e.preventDefault();
    refresh();
  }

  const langs = [
    { title: "DE"},
    { title: "EN"}
  ];
  const { language, setLanguage } = useLanguage();
  useEffect(() => {
    setLanguage(language)
  }, [language])


  return (
    <div className="container mx-auto">
      <Head>
        <title>{page.properties.title.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {langs.filter(l => l.title !== language).map(l => (
          <button key={l.title} className="ml-2 font-bold fixed top-0 right-0 px-4 rounded-bl-xl z-50 bg-white bg-opacity-20 shadow-md backdrop-blur-sm p-2" onClick={() => setLanguage(l.title)}>{l.title}</button> 
      ))}

      {hasCover && (
          <style>{`
            html::before {
              background-image: url('${hasCover}') !important;
            }
        `}</style>
        )} 

      <article>
        {showSignet && (
          <div className="max-w-xs mx-auto mt-10 mb-4">
            <img className="mx-auto" src="/signet.svg" />
          </div>
        )}

        <h1 className={onepager ? 'h1-title mb-10' : 'h1'}>
          {(parent && !hideBack) && (
            <>
              <Link href={`/page/${parent.id}`}>
                <Text text={parent.properties.title.title} /> 
              </Link>
              {' → '} 
            </>
          )}
          <a href="#" onClick={(e) => e.preventDefault()} onDoubleClick={reval}>
            <Text text={page.properties.title.title} />
          </a>
        </h1>

        {onepager ? (
          <div className="px-4 mb-4">
            <Blocks blocks={blocks} showChildren />
          </div>
        ) : (
          <section className="panel content">
            <Blocks blocks={blocks} />
          </section>
        )}
      </article>
      <p className="px-4 md:px-0 pb-4 relative">
        <div className={onepager ? 'mb:pt-4' : ''}>
        {parent ? (
        (<Link href={`/page/${parent.id}`} className="link">
          ←<Text text={parent.properties.title.title} /> 
        </Link>)
      ) : (
        <Link href="/" className="link">
            ← Startseite
          </Link>
          
        )}
        </div>
        {onepager && (
          <div className="childsticky dsk:hidden bx-container" style={{backgroundImage: "url('/background-red.jpg')"}}  />
        )}
      </p>
    </div>
  );
}

export const getStaticPaths = async () => {
  // const database = await getDatabase(databaseId);
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const onepager = page.icon?.emoji === "📃";
  const blocks = await getBlocks(id, true, false);
  let parent = false;
  if (page.parent.type === "page_id") {
    parent = await getPage(page.parent.page_id);
  }

  return {
    props: {
      page,
      onepager,
      blocks,
      parent,
    },
    revalidate: onepager ? 300 : 60, // 5min / 1 minute
  };
};
