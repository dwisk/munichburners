import Image from "next/image";
import { getStartpage } from "munichburners/lib/pages";
import Content from "munichburners/components/Content";

export async function generateMetadata() {
  return {
    title: "Munich Burners",
    openGraph: {
      description: `Find local burners in Munich`,
      images: [`/api/og`],
    }
}
}

export default async function Home() {

  const startpage = await getStartpage();

  return (
    <div className="container mx-auto">
      <main className="">
        <header className="mt-10 mb-10">
          <div className="max-w-xs mx-auto mb-6">
            <Image className="mx-auto" src="/signet.svg" alt="Munich Burners Logo" width={255} height={277}/>
          </div>
          <h1 className="text-center text-6xl font-title font-normal">
          Munich Burners
          </h1>
        </header>

        <Content content={startpage.content} />
      </main>
    </div>
  );
}

