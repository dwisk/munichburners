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

  const usagesByGrantStatusAccumlated = dreams.reduce((acc, dream) => {
    if (dream.grantStatus && !acc[dream.grantStatus]) {
      acc[dream.grantStatus] = 0;
    }
    if (dream.grantStatus) {
      acc[dream.grantStatus] += dream.grant || 0;
    }
    return acc;
  }
  , {
    OPEN: 0,
    CANCELED: 0,
    ACCEPTED: 0,
    INVOICES: 0,
    READY: 0,
    PAID: 0,
  });

  const usagesByGrantStatus = Object.entries(usagesByGrantStatusAccumlated).map(([status, value]) => ({
    value,
    color: `bg-${status === 'OPEN' ? 'blue-800' : status === 'CANCELED' ? 'red-800' : status === 'ACCEPTED' ? 'green-800' : status === 'INVOICES' ? 'cyan-800' : status === 'READY' ? 'lime-600' : 'green-500'} text-white bg-opacity-80`,
    label: `${status}`,
  })).filter((usage) => usage.value > 0);
  
  return (
    <div className="container mx-auto px-4 md:px-0 mb-10">
      <h1 className="text-2xl font-bold">
        {dreams.length} Dreams {dreamYear.name}
      </h1>
      
      <UsageBar max={dreamYear.budget} usages={usagesByGrantStatus} showLabels className="mb-2" />
      <UsageBar max={dreamYear.budget} usages={usages} showLabels showMax className="mb-12" />

      <MMBLogin />

      {dreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} dreamYear={dreamYear} userSecret={session?.user?.email || ''} />
      ))}
    </div>
  );
}


