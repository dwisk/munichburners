import { ContentDreams } from "munichburners/lib/content/schema";
import ContentFullstackDreamsList from "./ContentFullstackDreams";

export default function ContentDreamsList({ content }: { content: ContentDreams }) {
  if (content.Pool?.trim()) {
    return <ContentFullstackDreamsList pool={content.Pool} />;
  }

  if (!content.Year || !content.Year.documentId) {
    return <div>No dreams available for this year.</div>;
  }

  const dreams = content.Year.dreams || [];
  
  return (
    <div className="flex flex-col md:gap-px gap-2">
      {dreams.map((dream) => (
        <div key={dream.id} className="flex flex-col md:flex-row gap-px">
          <div className="md:w-1/3 bg-black p-2 bg-opacity-60 font-bold">
            {dream.name}
          </div>
          <div className="md:w-1/2 bg-black p-2 bg-opacity-40">
            {dream.shortDescription}
          </div>
          <div className="md:w-1/6 bg-black p-2 bg-opacity-40">
            <span className="font-bold">{dream.dreamType}</span> <span className="md:block">by {dream.dreamer}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
