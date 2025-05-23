import { getDreamYear } from "munichburners/lib/dreams";
import CSVdreams from "./CSVdreams";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


export default async function Page(props:PageProps) {
  const params = await props.params;
  const dreamYear = await getDreamYear(params.id);
  
  if (!dreamYear) {
    return <div>Dream year not found</div>;
  }

  return (<CSVdreams dreamYear={dreamYear} />)
}