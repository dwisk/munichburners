import Head from "next/head";
import { getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import Blocks from "../../components/Blocks";
import Text from "../../components/Text";
import { useRouter } from "next/dist/client/router";


export default function Page({ page, blocks, parent }) {
  if (!page || !blocks) {
    return <div />;
  }

  // refreshPage if notion data is older than 1h, aws-image links expire
  const router = useRouter();
  const cacheAge = Math.floor((new Date() - new Date(page.lastFetch)) / 1000) ;
  if (cacheAge > 3600)  router.replace(router.asPath);

  const onepager = page.icon?.emoji === "📃";
  const hasCover = page.cover?.file?.url;

  return (
    <div className="container mx-auto">
      <Head>
        <title>{page.properties.title.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {hasCover && (
          <style>{`
            body {
              background-image: url('${hasCover}') !important;
            }
        `}</style>
        )} 

      <article>
        {onepager && (
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
          <Text text={page.properties.title.title} />
        </h1>

        {onepager ? (
          <div className="px-4">
            <Blocks blocks={blocks} showChildren />
          </div>
        ) : (
          <section className="panel">
            <Blocks blocks={blocks} />
          </section>
        )}
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
  const childBlocks1 = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const childBlocks2 = await Promise.all(
    childBlocks1
    .filter((block) => block.children.length > 0)
    .reduce((a, c) => ([...a, ...c.children]),[])
    .filter((block) => block.has_children)
    .map(async (block) => {
      return {
        id: block.id,
        children: await getBlocks(block.id),
      };
    })
  );
  const childPages = await Promise.all(
    blocks
      .filter((block) => block.type === "child_page")
      .map(async (block) => {
        return {
          id: block.id,
          page: await getPage(block.id),
        };
      })
  );

  const childBlocks = [
    ...childBlocks1,
    ...childBlocks2
  ];

  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if ((block.has_children && !block[block.type].children)) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }

    // add level 2
    if (block[block.type].children) {      
      block[block.type].children.filter(childBlock => childBlock.has_children)
      .forEach(childBlock => {
        childBlock[childBlock.type]["children"] = childBlocks.find(
          (x) => x.id === childBlock.id
        )?.children;
        return childBlock;
      });
    }
    if (block.type === "child_page") {
      block[block.type] = {
        ...block[block.type],
        ...childPages.find(
          (x) => x.id === block.id
        )?.page
      }
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
