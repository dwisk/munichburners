import DreamCard from "munichburners/components/DreamCard";
import { UsageBar } from "munichburners/components/DreamUsage";
import MMBLogin from "munichburners/components/MMBLogin";
import { getSession } from "munichburners/lib/auth";
import { getDreams, getDreamYear } from "munichburners/lib/dreams";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


export default async function Page(props:PageProps) { 
  const session = await getSession()
  const params = await props.params;
  const dreamYear = await getDreamYear(params.id);  
  
  if (!dreamYear) {
    return <div>Dream year not found</div>;
  }
  const dreams = await getDreams(dreamYear.id.toString());

  const dreamGrantTotal = dreams.reduce((acc, dream) => {
    if (['ACCEPTED', 'INVOICES', 'READY', 'PAID'].includes(dream.grantStatus || '')) {
      return acc + (dream.grant || 0);
    }
    return acc;
  }, 0);
  
  const dreamRequestMin = dreams.reduce((acc, dream) => {
    if (!['ACCEPTED', 'INVOICES', 'READY', 'PAID'].includes(dream.grantStatus || '')) {
      return acc + (dream.requestMin || 0);
    }
    return acc;
  }, 0);
  const dreamRequestMax = dreams.reduce((acc, dream) => {
    if (!['ACCEPTED', 'INVOICES', 'READY', 'PAID'].includes(dream.grantStatus || '')) {
      return acc + (dream.requestMax || 0);
    }
    return acc;
  }, 0) - dreamRequestMin;

  const usages = [
    { value: dreamGrantTotal, color: "bg-white text-black bg-opacity-90", label: `${dreamGrantTotal}€ granted` },
    { value: dreamRequestMin, color: "bg-white text-white bg-opacity-40", label: `${dreamGrantTotal + dreamRequestMin}€ min` },
    { value: dreamRequestMax, color: "bg-white text-white bg-opacity-20", label: `${dreamGrantTotal + dreamRequestMin + dreamRequestMax}€ max` },
  ];
  
  return (
    <div className="container mx-auto px-4 md:px-0 mb-10">
      <h1 className="text-2xl font-bold">
        {dreams.length} Dreams {dreamYear.name}
      </h1>
      
      <UsageBar max={dreamYear.budget} usages={usages} showLabels showMax className="mb-12" />

      <MMBLogin />

      {dreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} dreamYear={dreamYear} userSecret={session?.user?.email || ''} />
      ))}
    </div>
  );
}


