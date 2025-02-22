import { ContentMap, ContentText, ContentType } from "munichburners/lib/content/schema";
import ReactMarkdown from "react-markdown";

export default function Content({content, language}:{content:ContentType[], language:'DE'|'EN'}) {
    return (
        <div>
            {content.map((item, index) => {
                switch (item.__component) {
                    case 'content.text':
                        return <Text key={index} content={item} language={language} />
                    case 'content.map':
                        return <Map key={index} content={item} />
                    default:
                        return <div key={index}>Unknown content type</div>
                }
            })}
        </div>
    );

}

function Text({content, language}:{content:ContentText, language:'DE'|'EN'}) {
    const text = language === 'DE' ? content.textDE : content.textEN;

    return (
        <ReactMarkdown>{text}</ReactMarkdown>
    );
}

function Map({content}:{content:ContentMap}) {
    const match = content.iFrameCode.match(/src="([^"]*)"/);
    const src = match ? match[1] : 'Invalid iFrame code';

    return (
        <iframe src={src} width="100%" height="450"  loading="lazy" allowFullScreen />
    );
}