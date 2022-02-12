
import { Fragment } from "react";
import styles from "./notionstyles.module.css";
import Text from "./Text";

  
export const Block = ({block, showChildren}) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
        case "paragraph":
        return (
            <p className="pb-4">
            <Text text={value.text} />
            </p>
        );
        case "heading_1":
        return (
            <h1 className="page-h1">
            <Text text={value.text} />
            </h1>
        );
        case "heading_2":
        return (
            <h2 className="page-h2">
            <Text text={value.text} />
            </h2>
        );
        case "heading_3":
        return (
            <h3 className="page-h3">
            <Text text={value.text} />
            </h3>
        );
        case "bulleted_list_item":
        case "numbered_list_item":
        return (
            <li>
            <Text text={value.text} />
            </li>
        );
        case "to_do":
        return (
            <div>
            <label htmlFor={id}>
                <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
                <Text text={value.text} />
            </label>
            </div>
        );
        case "toggle":
        return (
            <details>
            <summary>
                <Text text={value.text} />
            </summary>
            {value.children?.map((block) => (
                <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
            </details>
        );
        case "child_page":
            if (showChildren) { 
                return <>
                    <h1 className="page-h1 border-b border-orange-700">
                        <a href={`/page/${block.id}`}>
                            {value.title}
                        </a>
                    </h1>
                    <Blocks blocks={value.children} />
                </>;
            } 
            return <p><a className="font-black" href={`/page/${block.id}`}>→ {value.title}</a></p>;
        case "image":
        const src =
            value.type === "external" ? value.external.url : value.file.url;
        const caption = value.caption ? value.caption[0]?.plain_text : "";
        return (
            <figure>
            <img src={src} alt={caption} />
            {caption && <figcaption>{caption}</figcaption>}
            </figure>
        );
        case "divider":
        return <hr key={id} />;
        case "quote":
        return <blockquote className="panel m-0 mb-4 border-l-4" key={id}>
                <Text text={value.text} />
            </blockquote>;
        case "callout":
            // return <pre>{JSON.stringify(block, null, 2)}</pre>
        return <div className="panel flex m-0 mb-4 border-l-4 mt-2">
            <div className="mr-4">{value.icon.emoji}</div>
            <div><Text text={value.text}/></div>

        </div>
        case "code":
        return (
            <pre className={styles.pre}>
            <code className={styles.code_block} key={id}>
                {value.text[0].plain_text}
            </code>
            </pre>
        );
        case "file":
        const src_file =
            value.type === "external" ? value.external.url : value.file.url;
        const splitSourceArray = src_file.split("/");
        const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
        const caption_file = value.caption ? value.caption[0]?.plain_text : "";
        return (
            <figure>
            <div className={styles.file}>
                📎{" "}
                <Link href={src_file} passHref>
                {lastElementInArray.split("?")[0]}
                </Link>
            </div>
            {caption_file && <figcaption>{caption_file}</figcaption>}
            </figure>
        );
        default:
        return `❌ Unsupported block (${
            type === "unsupported" ? "unsupported by Notion API" : type
        })`;
    }
};

export default function Blocks({blocks, showChildren}) {
   return (<>
       {blocks.map((block) => (
           <Block key={block.id} block={block} showChildren={showChildren} />
          ))}
   </>)
} 