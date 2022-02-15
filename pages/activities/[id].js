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


export default function Activity({ publicPage, blocks }) {
  // return <pre>{JSON.stringify(page, null, 2)}</pre>

  const [codeword, setcodeword] = useState('');

  const { page } = usePage(publicPage, codeword);
  
  if (!page || !blocks) {
    return <div />;
  }

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
      <article>
        <h1 className="h1">
          <Text text={page.properties.Name.title} />
        </h1>

        <section className="panel">
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
        <Link href="/">
          <a className="link">← Startseite</a>
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
  const blocks = await getBlocks(id);

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });

  return {
    props: {
      publicPage: page,
      blocks: blocksWithChildren,
    },
    revalidate: 120,
  };
};
