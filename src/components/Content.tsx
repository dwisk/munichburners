import { ContentHeadline, ContentImage, ContentLinktree, ContentMap, ContentTeaser, ContentText, ContentType } from "munichburners/lib/content/schema";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import ContentActivitiesList from "./ContentActivities";
import ContentDreamsList from "./ContentDreams";

export default function Content({content}:{content:ContentType[]}) {
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
                    case 'content.headline':
                        return <Headline key={index} content={item} />
                    case 'content.teaser':
                        return <Teaser key={index} content={item} />
                    case 'content.linktree':
                        return <LinkTree key={index} content={item} />
                    case 'content.activities':
                        return <ContentActivitiesList key={index} content={item} />
                    case 'content.dreams':
                        return <ContentDreamsList key={index} content={item} />
                    default:
                        return <div key={index}>
                            Unknown content type {item['__component']}
                            <pre>{JSON.stringify(item,null,2)}</pre>

                            </div>
                }
            })}
        </div>
    );

}

function LinkRenderer(props: { href?: string; children?: React.ReactNode }) {
    return (
      <a href={props.href} target="_blank" rel="noreferrer">
        {props.children}
      </a>
    );
  }

function Text({content}:{content:ContentText}) {
    return (
        <div className="markdown">
            <ReactMarkdown components={{ a: LinkRenderer}} remarkPlugins={[remarkGfm]}>{content.text}</ReactMarkdown>
        </div>
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

function Headline({content}:{content:ContentHeadline}) {
    return (<>
        <h2 className="h2 font-title text-center leading-5 mt-10 font-bold">{content.headline}</h2>
        {content.subline && <div className="text-center uppercase text-xs font-bold mt-2">{content.subline}</div>}
        </>
    )
}

function Teaser({content}:{content:ContentTeaser}) {
    // get panels with type paragraph
    const panels = content.panels.filter(panel => panel.type === 'paragraph');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 mx-0 font-title font-bold">
            {panels.map((panel, index) => (
                <div key={index} className="gridpanel h2 py-5 md:px-5 leading-8">
                    {panel.children.filter((child) => child.type === 'text').map((child, index) => (
                        <ReactMarkdown key={index} components={{ a: LinkRenderer}}>{child.text}</ReactMarkdown>
                    ))}
                </div>
            ))}
        </div>
    )
}


function LinkTree({content}:{content:ContentLinktree}) {
    // reduce links from content to only paragraph with children links
    const links = content.links.filter(link => link.type === 'paragraph').map(link => link.children.filter(child => child.type === 'link'));
    const mdMaxCols = links.length > 6 ? 6 : links.length;
    return (
        <div className="panel">
            <ul className={`grid grid-cols-2 md:grid-cols-${mdMaxCols} gap-4`}>
                {links.map((link, index) => (
                    <li key={index} className="link text-center uppercase">
                        <a href={link[0].url
                        } target="_blank">{link[0].children[0].text}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}