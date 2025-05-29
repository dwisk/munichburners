import DreamCard from "munichburners/components/DreamCard";
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
    if (['ACCEPTED', 'INVOICES', 'PAID'].includes(dream.grantStatus)) {
      return acc + dream.grant;
    }
    return acc;
  }, 0);
  
  const dreamRequestMin = dreams.reduce((acc, dream) => {
    if (!['ACCEPTED', 'INVOICES', 'PAID'].includes(dream.grantStatus)) {
      return acc + dream.requestMin;
    }
    return acc;
  }, 0);
  const dreamRequestMax = dreams.reduce((acc, dream) => {
    if (!['ACCEPTED', 'INVOICES', 'PAID'].includes(dream.grantStatus)) {
      return acc + dream.requestMax;
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
        <DreamCard key={dream.id} dream={dream} dreamYear={dreamYear} session={session} />
      ))}
    </div>
  );
}


type Usage = {
  value: number;
  color: string; // Tailwind class like 'bg-green-500'
  label:string
};

type UsageBarProps = {
  max: number;
  usages: Usage[];
  showLabels?: boolean;
  showMax?: boolean;
  className?: string;
};

export const UsageBar: React.FC<UsageBarProps> = ({ max, usages, showLabels = false, showMax = false, className }) => {
  const totalUsage = usages.reduce((acc, usage) => acc + usage.value, 0);
  const diplayedMax = Math.max(max, totalUsage);

  const overMax = diplayedMax > max;

  return (
    <div className={`w-full ${showLabels ? 'h-6' : 'h-2'} bg-gray-200 bg-opacity-15 rounded-full relative ${className}`}>
      {showMax && (
      <div 
        className={`absolute h-full ${overMax ? 'w-[4px] bg-red-500':''} `}
        style={{ left: `${(max / diplayedMax) * 100}%` }}
      >
        <span className="absolute top-6 right-0 text-xs vertical-center flex items-center h-full ml-2 text-white font-bold whitespace-nowrap">
          BUDGET= {max}€ &uarr;
          </span>
        </div>
      )}
      <div className="h-full w-full flex  overflow-hidden rounded-full">

      
      {usages.map((usage, index) => {
      const widthPercent = (usage.value / diplayedMax) * 100;

      return (
        <div
        key={index}
        className={`h-full ${usage.color} truncate text-xs vertical-center flex items-center justify-end ${showLabels ? 'px-1' : ''}`}
        style={{ width: `${widthPercent}%` }}
        >
          {showLabels && (  
            <>{usage.label}</>
          )}
        </div>
      );
      })}
      </div>
    </div>
  );
};