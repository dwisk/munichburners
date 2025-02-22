import { ContentImage, ContentMap, ContentText, ContentType } from "munichburners/lib/content/schema";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function Content({content, language}:{content:ContentType[], language:'DE'|'EN'}) {
    return (
        <div>
            {content.map((item, index) => {
                switch (item.__component) {
                    case 'content.text':
                        return <Text key={index} content={item} />
                    case 'content.map':
                        return <Map key={index} content={item} />
                    case 'content.image':
                        return <ImageContent key={index} content={item} />
                    default:
                        return <div key={index}>Unknown content type {item['__component']}</div>
                }
            })}
        </div>
    );

}

function Text({content}:{content:ContentText}) {
    return (
        <ReactMarkdown>{content.text}</ReactMarkdown>
    );
}

function ImageContent({content}:{content:ContentImage}) {
    if (!content.image) {
        return null;
    }
    return(
        <figure>
            <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${content.image.formats.large.url}`}
            alt={content.image.caption}
            width={content.image.formats.large.width}
            height={content.image.formats.large.height}
            />
            {content.image.caption && <figcaption>{content.image.caption}</figcaption>}
        </figure>
    )
}

function Map({content}:{content:ContentMap}) {
    const match = content.iFrameCode.match(/src="([^"]*)"/);
    const src = match ? match[1] : 'Invalid iFrame code';

    return (
        <iframe src={src} width="100%" height="450"  loading="lazy" allowFullScreen />
    );
}