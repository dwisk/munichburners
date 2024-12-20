import Head from "next/head";
import Link from "next/link";
import ActivityMeta from "../components/ActivityMeta";
import { getDatabase } from "../lib/notion";
import Text from "../components/Text.js";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
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
          <h1 className="text-center text-6xl">
          Munich Burners

          </h1>
        </header>
        
        
        <h2 className="h2 text-center leading-5 mt-10">Munich Micro Burn 2025<br /><small className="text-center uppercase text-xs">let's burn together</small></h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mx-5 my-5">
          <div className="gridpanel h2 p-5 leading-8">Community<br/>Gathering</div>
          <div className="gridpanel h2 p-5 leading-5">05.06.2025<br/>-<br/>09.06.2025</div>
          <div className="gridpanel h2 p-5 leading-8">South of<br/>Munich</div>
        </div>

        <h2 className="h2 text-center leading-5 mt-10">Community Places<br /><small className="text-center uppercase text-xs">get connected online</small></h2>
        
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
        <ol className="">
          {posts.filter(post => new Date(post.properties.Date.date.start.substr(0, 10)) > new Date().setHours(0) )
                .sort((a,b) => a.properties.Date.date.start > b.properties.Date.date.start ? 1 : -1)
                .map((post) => {
            
            return (
              <li key={post.id} className="panel">
                {/* <pre>{JSON.stringify(post, null, 2)}</pre> */}
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
        </ol>
        <p className="px-4 md:px-0 pb-4 text-center">
          <a href="/api/activities.ics" className="link">In Kalender importieren ↓</a>
        </p>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);
  return {
    props: {
      posts: database,
      // for local dev
      // posts: [{"object":"page","id":"101a338f-3123-4376-8466-7a861a99ab23","created_time":"2022-02-11T16:48:00.000Z","last_edited_time":"2022-02-11T16:49:00.000Z","cover":null,"icon":null,"parent":{"type":"database_id","database_id":"002a9c34-1664-4ee4-9dd2-21f35906d8dc"},"archived":false,"properties":{"Date":{"id":"EP%7Ce","type":"date","date":{"start":"2022-02-02","end":"2022-02-06","time_zone":null}},"Location":{"id":"IyjK","type":"rich_text","rich_text":[{"type":"text","text":{"content":"Bad Gastein","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"Bad Gastein","href":null}]},"Description":{"id":"QvCN","type":"rich_text","rich_text":[{"type":"text","text":{"content":"Kleiner Skiausflug","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"Kleiner Skiausflug","href":null}]},"Tags":{"id":"VFFH","type":"multi_select","multi_select":[]},"Name":{"id":"title","type":"title","title":[{"type":"text","text":{"content":"Munich Burner Skiing ","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"Munich Burner Skiing ","href":null}]}},"url":"https://www.notion.so/Munich-Burner-Skiing-101a338f3123437684667a861a99ab23"},{"object":"page","id":"9685a287-e90c-4457-98f3-0adee4e457a4","created_time":"2022-02-11T13:52:00.000Z","last_edited_time":"2022-02-11T16:46:00.000Z","cover":null,"icon":null,"parent":{"type":"database_id","database_id":"002a9c34-1664-4ee4-9dd2-21f35906d8dc"},"archived":false,"properties":{"Date":{"id":"EP%7Ce","type":"date","date":{"start":"2022-05-25","end":"2022-05-29","time_zone":null}},"Location":{"id":"IyjK","type":"rich_text","rich_text":[{"type":"text","text":{"content":"Süd-Westlich von München","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"Süd-Westlich von München","href":null}]},"Description":{"id":"QvCN","type":"rich_text","rich_text":[{"type":"text","text":{"content":"3. Microburn","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"3. Microburn","href":null}]},"Tags":{"id":"VFFH","type":"multi_select","multi_select":[]},"Name":{"id":"title","type":"title","title":[{"type":"text","text":{"content":"Munich Micro Burn 2022","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"Munich Micro Burn 2022","href":null}]}},"url":"https://www.notion.so/Munich-Micro-Burn-2022-9685a287e90c445798f30adee4e457a4"},{"object":"page","id":"e53654e5-3ebf-4dca-9a00-419bef084373","created_time":"2022-02-11T13:38:00.000Z","last_edited_time":"2022-02-11T16:26:00.000Z","cover":null,"icon":null,"parent":{"type":"database_id","database_id":"002a9c34-1664-4ee4-9dd2-21f35906d8dc"},"archived":false,"properties":{"Date":{"id":"EP%7Ce","type":"date","date":{"start":"2022-02-13T18:00:00.000+01:00","end":null,"time_zone":null}},"Location":{"id":"IyjK","type":"rich_text","rich_text":[{"type":"text","text":{"content":"https://meet.google.com/tqo-osfs-wsi","link":{"url":"https://meet.google.com/tqo-osfs-wsi?fbclid=IwAR3V5AJQY9ajTjqv_pq_VFZfk0vsI7JIuCkYeHSZDVqFmVpp7-Ksc9-VQH4"}},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"https://meet.google.com/tqo-osfs-wsi","href":"https://meet.google.com/tqo-osfs-wsi?fbclid=IwAR3V5AJQY9ajTjqv_pq_VFZfk0vsI7JIuCkYeHSZDVqFmVpp7-Ksc9-VQH4"}]},"Description":{"id":"QvCN","type":"rich_text","rich_text":[{"type":"text","text":{"content":"Virtuelles KickOff Meeting um den MicroBurn zu planen","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"Virtuelles KickOff Meeting um den MicroBurn zu planen","href":null}]},"Tags":{"id":"VFFH","type":"multi_select","multi_select":[]},"Name":{"id":"title","type":"title","title":[{"type":"text","text":{"content":"KickOff - Munich Micro Burn ‘22","link":null},"annotations":{"bold":false,"italic":false,"strikethrough":false,"underline":false,"code":false,"color":"default"},"plain_text":"KickOff - Munich Micro Burn ‘22","href":null}]}},"url":"https://www.notion.so/KickOff-Munich-Micro-Burn-22-e53654e53ebf4dca9a00419bef084373"}],
    },
    revalidate: 120,
  };
};
