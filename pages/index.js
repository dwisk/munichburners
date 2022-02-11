import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[id].js";
import styles from "./index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Munich Burners</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logos}>
            <img src="./logo.svg" />
          </div>
          <h1>Munich Burners</h1>
          <p>
            Community sparks
          </p>
        </header>
        <h2 className={styles.heading}>Links</h2>
        <ol className={styles.posts}>
          <li>SLACK <a href="https://munichburners.slack.com" target="_blank"> → Hier hin </a> </li>
          <li>FACEBOOK <a href="https://www.facebook.com/groups/1421833524754523" target="_blank"> → Hier hin </a> </li>
          <li>TELEGRAM <a href="https://t.me/munichburners" target="_blank"> → Hier hin </a> </li>
          <li>WHATSAPP → Gibt's auch, am besten via Slack, Facebook oder Telegram fragen </li>
        </ol>

        <h2 className={styles.heading}>Aktivitäten / Activities</h2>
        <ol className={styles.posts}>
          {posts.filter(post => new Date(post.properties.Date.date.start.substr(0, 10)) > new Date().setHours(0) )
                .sort((a,b) => a.properties.Date.date.start > b.properties.Date.date.start ? 1 : -1)
                .map((post) => {
            const date = new Date(post.properties.Date.date.start).toLocaleString(
              "de-DE",
              post.properties.Date.date.start.length > 10 ? {
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              } : {
                month: "long",
                day: "2-digit",
                year: "numeric"
              }
            );
            const enddate = post.properties.Date.date.end && new Date(post.properties.Date.date.end).toLocaleString(
              "de-DE",
              post.properties.Date.date.start.length > 10 ? {
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              } : {
                month: "long",
                day: "2-digit",
                year: "numeric"
              }
            );
            return (
              <li key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${post.id}`}>
                    <a>
                      <Text text={post.properties.Name.title} />
                    </a>
                  </Link>
                </h3>

                <p className={styles.postDescription}>
                  {date}
                  {enddate && (
                    <>{` - ${enddate}`}</>
                  )}
                  {' '}
                  <Text text={post.properties.Location.rich_text} />
                </p>
                {post.properties.Description && (
                  <p className={styles.postDescription}>
                    <Text text={post.properties.Description.rich_text} />
                  </p>
                )}
                <Link href={`/${post.id}`}>
                  <a> Mehr lesen →</a>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 120,
  };
};
