import styles from "./notionstyles.module.css";

export default function Text ({ text }) {
    if (!text) {
      return null;
    }
    return text.map((value, id) => {
      const {
        annotations: { bold, code, color, italic, strikethrough, underline },
        text,
      } = value;
      const hasStyles = bold || code || italic || strikethrough || underline;
      const content = text.link ? <a href={text.link.url} className="underline">{text.content}</a> : text.content;
      if (text.content === "\n") return <br />
      if (text.content === "\n\n") return <><br /><br/></>;
      if (hasStyles || color !== "default") {
        return (
          <span
            key={id}
            className={[
              bold ? styles.bold : "",
              code ? styles.code : "",
              italic ? styles.italic : "",
              strikethrough ? styles.strikethrough : "",
              underline ? styles.underline : "",
            ].join(" ")}
            style={color !== "default" ? { color } : {}}
          >
            {content}
          </span>
        );
      }
      return content;
    });
  };