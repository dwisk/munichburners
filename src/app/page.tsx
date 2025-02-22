import Head from "next/head";
import { getActivities } from "../lib/activities";

export default async function Home() {
  const activities = await getActivities();

  return (
    <div className="container mx-auto">
      <Head>
        <title>Munich Burners</title>
        <meta
          property="og:image"
          content={`https://munichburners.de/api/og`}
        />
      </Head>

      <main className="">
        <header className="mt-10 mb-10">
          <div className="max-w-xs mx-auto mb-6">
            <img className="mx-auto" src="./signet.svg" />
          </div>
          <h1 className="text-center text-6xl font-title">
          Munich Burners
          </h1>
        </header>
        
        
        <h2 className="h2 text-center leading-5 mt-10 font-bold">Munich Micro Burn 2025</h2>
        <div className="text-center uppercase text-xs font-bold mt-2">let's burn together</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mx-5 my-5 font-title font-bold">
          <div className="gridpanel h2 p-5 leading-8">Community<br/>Gathering</div>
          <div className="gridpanel h2 p-5 leading-5">05.06.2025<br/>-<br/>09.06.2025</div>
          <div className="gridpanel h2 p-5 leading-8">South of<br/>Munich</div>
        </div>

        <h2 className="h2 text-center leading-5 mt-10 font-bold pb-0">Community Places</h2>
        <div className="text-center uppercase text-xs font-bold mt-2">get connected online</div>
        
        <div className="panel">
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <li className="link text-center"><a href="http://discord.munichburners.de" target="_blank">DISCORD</a> </li>
            <li className="link text-center"><a href="http://fb.munichburners.de" target="_blank">FACEBOOK</a> </li>
            <li className="link text-center"><a href="http://telegram.munichburners.de" target="_blank">TELEGRAM</a> </li>
            <li className="link text-center"><a href="http://signal.munichburners.de" target="_blank">SIGNAL</a> </li>
            <li className="link text-center line-through">WHATSAPP </li>
          </ul>
          </div>

        <h2 className="h2 text-center leading-5 mt-10">Burner Activities<br /><small className="text-center uppercase text-xs">meet for real</small></h2>
        <pre>{JSON.stringify(activities,null,2)}</pre>
        {/* <ol className="">
          {posts.filter(post => new Date(post.properties.Date.date.start.substr(0, 10)) > new Date().setHours(0) )
                .sort((a,b) => a.properties.Date.date.start > b.properties.Date.date.start ? 1 : -1)
                .map((post) => {
            
            return (
              <li key={post.id} className="panel">
                <h3 className="link">
                  <Link href={`/activities/${post.id}`}>

                    <Text text={post.properties.Name.title} />

                  </Link>
                </h3>

                <ActivityMeta post={post} />
                {post.properties.Description && (
                  <p className="mb-4">
                    <Text text={post.properties.Description.rich_text} />
                  </p>
                )}
                <p className="text-right">
                <Link href={`/activities/${post.id}`} className="font-black">
                   Mehr lesen →
                </Link>
                </p>
              </li>
            );
          })}
        </ol> */}
        <p className="px-4 md:px-0 pb-4 text-center">
          <a href="/api/activities.ics" className="link">In Kalender importieren ↓</a>
        </p>
      </main>
    </div>
  );
}

