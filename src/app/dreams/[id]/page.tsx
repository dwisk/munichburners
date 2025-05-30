import DreamCard from "munichburners/app/dreams/_components/DreamCard";
import { UsageBar } from "munichburners/app/dreams/_components/DreamUsage";
import MMBLogin from "munichburners/components/MMBLogin";
import { getSession } from "munichburners/lib/auth";
import { getDreamColor, getDreamEmoji, getDreamLabel, getDreams, getDreamYear } from "munichburners/lib/dreams";
import { DreamGrantStatus } from "munichburners/lib/dreams/schema";

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
  const dreamGrantPlanned = dreams.reduce((acc, dream) => {
    if (['PLANNED'].includes(dream.grantStatus || '')) {
      return acc + (dream.grant || 0);
    }
    return acc;
  }, 0);
  
  const dreamRequestMin = dreams.reduce((acc, dream) => {
    if (!['PLANNED', 'ACCEPTED', 'INVOICES', 'READY', 'PAID', 'CANCELED'].includes(dream.grantStatus || '')) {
      return acc + (dream.requestMin || 0);
    }
    return acc;
  }, 0);
  const dreamRequestMax = dreams.reduce((acc, dream) => {
    if (!['PLANNED', 'ACCEPTED', 'INVOICES', 'READY', 'PAID', 'CANCELED'].includes(dream.grantStatus || '')) {
      return acc + (dream.requestMax || 0);
    }
    return acc;
  }, 0) - dreamRequestMin;

  const usages = [
    { value: dreamGrantTotal, color: "bg-white text-black bg-opacity-90", label: `${dreamGrantTotal}€ ${getDreamLabel('ACCEPTED')}` },
    { value: dreamGrantPlanned, color: "bg-white text-black bg-opacity-60", label: `${dreamGrantTotal + dreamGrantPlanned}€ ${getDreamLabel('PLANNED')}` },
    { value: dreamRequestMin, color: "bg-white text-white bg-opacity-40", label: `${dreamGrantTotal + dreamGrantPlanned +  dreamRequestMin}€ min` },
    { value: dreamRequestMax, color: "bg-white text-white bg-opacity-20", label: `${dreamGrantTotal + dreamGrantPlanned + dreamRequestMin + dreamRequestMax}€ max` },
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
    PLANNED: 0,
    CANCELED: 0,
    ACCEPTED: 0,
    INVOICES: 0,
    READY: 0,
    PAID: 0,
  });

  const usagesByGrantStatus = Object.entries(usagesByGrantStatusAccumlated).map(([status, value]) => ({
    value,
    color: `${getDreamColor(status as DreamGrantStatus)} text-white bg-opacity-80`,
    label: `${getDreamLabel(status as DreamGrantStatus)} ${getDreamEmoji(status as DreamGrantStatus)}`,
  })).filter((usage) => usage.value > 0);

  const yourDreams = dreams.filter((dream) => dream.dreamerSecret === session?.user?.email || '');
  
  return (
    <div className="container mx-auto px-4 md:px-0 mb-10">
      <h1 className="text-4xl font-bold">
        {dreams.length} Dreams {dreamYear.name}
      </h1>
      
      <h1 className="text-2xl font-bold mb-4">Budget</h1>
      <UsageBar max={dreamYear.budget} usages={usagesByGrantStatus} showLabels className="mb-2" />
      <UsageBar max={dreamYear.budget} usages={usages} showLabels showMax className="mb-8" />

      <p className="text-sm mb-4 text-center">
        Du hast einen Dream und willst ihn bearbeiten und dein Budget bekommen? Dann melde dich bitte an.<br />
        <MMBLogin className="mt-2 btn-sm" />
      </p>

      {yourDreams.length > 0 && (
        <>
          <h1 className="text-lg font-bold mb-4">Deine Dreams</h1>
          {yourDreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} dreamYear={dreamYear} userSecret={session?.user?.email || ''} />
          ))}
        </>
      )}      


      <h1 className="text-3xl font-bold mb-4">Alle {dreams.length} Dreams</h1>
      {dreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} dreamYear={dreamYear} userSecret={session?.user?.email || ''} />
      ))}
    </div>
  );
}


