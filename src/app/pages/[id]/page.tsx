import PageDetails from "munichburners/components/PageDetails";
import { getPage } from "munichburners/lib/pages";
import { ChildPage, Page } from "munichburners/lib/pages/schema";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  }
};

export async function generateMetadata(props:PageProps) {
  const params = await props.params;
  const page = await getPage(params.id);
  if (!page) {
    return {
      title: "Munich Burners",
      openGraph: {
        description: `Find local burners in Munich`,
        images: [`/api/og`],
      }
    }
  }

  return {
    title: `Munich Burners - ${page.name}`,
    openGraph: {
      title: `Munich Burners - ${page.name}`,
      images: [`/api/og?title=${page.name}`],
    }
  }
}

export default async function PagePage(props:PageProps) {
  const params = await props.params;
  const page = await getPage(params.id);
  
  if (!page) {
    return <div>Activity {params.id} not found</div>;
  }


  return (<>
    {/* <pre>{JSON.stringify(page,null,2)}</pre> */}  
    {page.background && (
      <style>{`
        html::before {
          background-image: url('/_next/image?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${page.background.formats.large.url}`)}&w=2048&q=75') !important;
        }
    `}</style>
    )} 
    <PageDetails page={page} />
    <div className="pt-20">
      {page.childPages && page.childPages.map(childPage => <SubPage key={childPage.id} childPage={childPage} />)}
    </div>
    <p className="container mx-auto px-4 md:px-0 mb-10">
          <Link href="/" className="link">
            ← Startseite
          </Link>
        </p>
  </>);
}

async function SubPage({childPage}:{childPage:ChildPage}) {
  const page = await getPage(childPage.page.documentId);

  const backgroundImage = page.background ? `url('/_next/image?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${page.background.formats.large.url}`)}&w=2048&q=75')` : 'none';

  return <div style={{backgroundImage}} className={page.background ? 'childpage dsk:py-20 relative pt-20 bx-container mb:bg-none bg-fixed bg-cover bg-cente' : 'py-20'}>
    <PageDetails page={page} />
    <div className="childsticky dsk:hidden bx-container" style={{backgroundImage}}  />
  </div>;
}
