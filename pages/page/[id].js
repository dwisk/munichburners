import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import { databaseId } from "../index.js";
import ActivityMeta from "../../components/ActivityMeta";
import NotionPage from "../../components/Blocks";
import Text from "../../components/Text";


export default function Page({ page, blocks, parent }) {
  return <pre>{JSON.stringify(blocks, null, 2)}</pre>
  if (!page || !blocks) {
    return <div />;
  }
  return (
    <div className="container mx-auto">
      <Head>
        <title>{page.properties.title.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article>
        <h1 className="h1">
          <Text text={page.properties.title.title} />
        </h1>

        <section className="panel">

          <NotionPage blocks={blocks} />
        </section>
      </article>
      <p className="px-4 md:px-0 pb-4">
        {parent ? (
        <Link href={`/page/${parent.id}`}>
          <a className="link">← <Text text={parent.properties.title.title} /> </a>
        </Link>
      ) : (
        <Link href="/">
            <a className="link">← Startseite</a>
          </Link>
          
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
  const blocks = await getBlocks(id);
  let parent = false;
  if (page.parent.type === "page_id") {
    parent = await getPage(page.parent.page_id);
  }

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
      page,
      blocks: blocksWithChildren,
      parent,
    },
    revalidate: 120,
  };
};
