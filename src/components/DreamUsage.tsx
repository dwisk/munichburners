export type Usage = {
  value: number;
  color: string; // Tailwind class like 'bg-green-500'
  label:string
};

export type UsageBarProps = {
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