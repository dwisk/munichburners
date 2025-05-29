import { getDreamYear } from "munichburners/lib/dreams";
import CSVdreams from "./CSVdreams";
import { getSession } from "munichburners/lib/auth";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


export default async function Page(props:PageProps) {
  const params = await props.params;
  const dreamYear = await getDreamYear(params.id);
  const session = await getSession();

  
  if (!dreamYear) {
    return <div>Dream year not found</div>;
  }

  if (!session || !session.user || !session.user.email) {
    return <div>Please log in to view the CSV<pre>{JSON.stringify(session)}</pre></div>;
  }

  return (<CSVdreams dreamYear={dreamYear} userSecret={session?.user?.email} />)
}