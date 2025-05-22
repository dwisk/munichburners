import { getDreamYear } from "munichburners/lib/dreams";

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


  const dreams = dreamYear.dreams.filter((dream) => {
    return dream.budgetNeed !== 'NONE';
  });

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
        <br /><small className="text-sm">with financial support</small>
      </h1>
      
      <UsageBar max={dreamYear.budget} usages={usages} showLabels className="mb-12" />

      {dreams.map((dream) => (
        <div key={dream.id} className="card relative gridpanel mb-4 rounded-lg">
          <div className="p-4">
          <h2 className="text-2xl font-bold">
            {dream.name}
          </h2>
          
          <p>
            <span className="font-bold">{dream.dreamType}</span> by {dream.dreamer}: {dream.shortDescription}
          </p>
          {dream.budgetNeed !== 'NONE' && (
            <UsageBar max={dreamYear.budget} className="mt-4" usages={[
              { value: dream.requestMin, color: "bg-white bg-opacity-60", label: 'min' },
              { value: dream.requestMax - dream.requestMin, color: "bg-white bg-opacity-30", label: 'max' },
            ]} />
          )}
          </div>

          <div className="w-full bg-black bg-opacity-20 flex justify-items-stretch gap-px leading-5">
            {dream.budgetNeed !== 'NONE' && (<>
              <div className={`bg-black p-3 flex items-center ${dream.budgetNeed === 'MUST' ? '' : 'bg-opacity-30'}`}>{dream.budgetNeed}</div>
            </>)}
            {dream.budgetNeed !== 'NONE' && (<div className="bg-black bg-opacity-60 grow p-3 text-center">
              {dream.requestMin}€ min
            </div>)}
            {dream.budgetNeed !== 'NONE' && (<div className="bg-black bg-opacity-60 grow p-3 text-center">
              {dream.requestMax}€ max
            </div>)}
            {dream.grant > 0 && (
              <div className={`${['ACCEPTED','INVOICE','PAID'].includes(dream.grantStatus) ? 'bg-green-800' :'bg-black'} bg-opacity-60 grow font-bold p-3 text-right`}>{dream.grant}€ granted</div>
            )}
          </div>
          
        </div>
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
  className?: string;
};

const UsageBar: React.FC<UsageBarProps> = ({ max, usages, showLabels = false, className }) => {
  const totalUsage = usages.reduce((acc, usage) => acc + usage.value, 0);
  const diplayedMax = Math.max(max, totalUsage);

  const overMax = diplayedMax > max;

  return (
    <div className={`w-full ${showLabels ? 'h-6' : 'h-2'} bg-gray-200 bg-opacity-15 rounded-full relative ${className}`}>
      {showLabels && (
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
        className={`h-full ${usage.color} truncat text-xs vertical-center flex items-center justify-end ${showLabels ? 'px-1' : ''}`}
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