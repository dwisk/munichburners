import Head from "next/head";
import { getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import Blocks from "../../components/Blocks";
import Text from "../../components/Text";
import { useRouter } from "next/dist/client/router";
import { revalidatePage } from "../../lib/_clienthelpers";


export default function Page({ page, blocks, parent, onepager }) {
  if (!page || !blocks) {
    return <div />;
  }

  // refreshPage if notion data is older than 1h, aws-image links expire
  const router = useRouter();
  const cacheAge = Math.floor((new Date() - new Date(page.lastFetch)) / 1000) ;
  if (cacheAge > 3600 * 2)  router.replace(router.asPath);

  const showSignet = onepager || page.icon?.emoji === "🔥";
  const hasCover = page.cover?.file?.url;

  const reval = (e) => {
    e.preventDefault();
    revalidatePage(page.id);
  }

  return (
    <div className="container mx-auto">
      <Head>
        <title>{page.properties.title.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
          {parent && (
            <>
              <Link href={`/page/${parent.id}`}>
                <a><Text text={parent.properties.title.title} /> </a>
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
          <section className="panel">
            <Blocks blocks={blocks} />
          </section>
        )}
      </article>
      <p className="px-4 md:px-0 pb-4 relative">
        <div className={onepager ? 'mb:pt-4' : ''}>
        {parent ? (
        <Link href={`/page/${parent.id}`}>
          <a className="link">← <Text text={parent.properties.title.title} /> </a>
        </Link>
      ) : (
        <Link href="/">
            <a className="link">← Startseite</a>
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
