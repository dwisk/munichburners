import { Activity } from "munichburners/lib/activities/schema";

export default function ActivityMeta({activity, locale='de-DE'}: {activity: Activity, locale?:string}) {
    const date = new Date(activity.startDate).toLocaleString(
        locale,
        activity.startDate.length > 10 ? {
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

      let enddate:string|boolean = false;
      if (activity.endDate && activity.startDate.length > 10) {
        enddate = new Date(activity.endDate).toLocaleString(
          locale,
          activity.endDate && activity.startDate.substr(0,10) === activity.endDate.substr(0,10) ? {
            hour: "2-digit",
            minute: "2-digit"
          } : {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: 'Europe/Berlin'
          });
      } else if (activity.endDate) {
        enddate = new Date(activity.endDate).toLocaleString(
          locale,
          {
            month: "long",
            day: "2-digit",
            year: "numeric",
            timeZone: 'Europe/Berlin'
          });
      }
      
    return (<p className="my-2 text-white">
    <span className="icon-cal">{date}
    {enddate && (
      <>{` - ${enddate}`}</>
    )}
    </span>
    <span className="block md:inline md:ml-4 icon-pin">
      {activity.location}
    </span>
  </p>)
} 