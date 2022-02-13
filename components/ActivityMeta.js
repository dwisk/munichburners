import Text from "./Text.js";

export default function ActivityMeta({post}) {
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

      let enddate = false;
      if (post.properties.Date.date.end && post.properties.Date.date.start.length > 10) {
        enddate = new Date(post.properties.Date.date.end).toLocaleString(
          "de-DE",
          post.properties.Date.date.end && post.properties.Date.date.start.substr(0,10) === post.properties.Date.date.end.substr(0,10) ? {
            hour: "2-digit",
            minute: "2-digit"
          } : {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
      } else if (post.properties.Date.date.end) {
        enddate = new Date(post.properties.Date.date.end).toLocaleString(
          "de-DE",
          {
            month: "long",
            day: "2-digit",
            year: "numeric",
          });
      }
      
    return (<p className="my-2 text-white">
    <span className="icon-cal">{date}
    {enddate && (
      <>{` - ${enddate}`}</>
    )}
    </span>
    <span className="block md:inline md:ml-4 icon-pin">
      <Text text={post.properties.Location.rich_text} />
    </span>
  </p>)
} 