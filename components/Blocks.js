
import { Fragment, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import styles from "./notionstyles.module.css";
import Text from "./Text";

  
export const Block = ({block, showChildren}) => {
    const { type, id } = block;
    const value = block[type];

    const { language, setLanguage } = useLanguage();
    useEffect(() => {
      setLanguage(language)
    }, [language])

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
        case "table":
            // language "table"
            if (value.table_width === 2 && value.has_column_header && ["DE","EN","Deutsch","English"].includes(value.children[0]?.table_row?.cells[0][0]?.plain_text)) {
                const langs = value.children[0].table_row.cells.map(lang => ({
                    title: lang.map(t => t.plain_text).join(" "),
                    children: []
                }));
                
                value.children.forEach((row, i) => {
                    if (i > 0) {
                        row.table_row.cells.forEach((cell, i) => {
                            langs[i].children.push(<p><Text text={cell} /></p>);
                        })
                    }
                });

                const lang = langs.find(l => l.title === language) || langs[0];

                return (
                    <div className="relative">
                        <small className="float-right mt-1 border-orange-700 border-dotted text-orange-500 ml-4 my-2">
                            <span className="font-bold">{lang.title}</span>
                            {langs.filter(l => l.title !== language).map(l => (
                                <button className="ml-2" onClick={() => setLanguage(l.title)}>{l.title}</button> 
                            ))}
                        </small>
                        {lang.children}
                    </div>
                );
            }

            // simple table
            return (
                <table className="w-full my-4 border-separate" style={{borderSpacing: 2}}>
                    {value.children.map((row, i) => (
                        <tr>
                            {row.table_row.cells.map((cell, j) => (
                                <td className={`border border-transparent p-2 ${value.has_column_header & i === 0 || value.has_row_header & j === 0 ? 'font-bold bg-black/50' : 'bg-black/25'}`}>
                                    <Text text={cell} />
                                </td>
                            ))}
                            
                        </tr>
                    ))}
                </table>
            )

        
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