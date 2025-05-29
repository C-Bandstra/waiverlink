import { useState } from "react";

const MAX_LENGTH = 50;

const TruncatedCell: React.FC<{ value: any; type: string }> = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  const content =
    typeof value === "object" && value?.props?.children
      ? value.props.children
      : String(value ?? "");

  if (content.length <= MAX_LENGTH) {
    return <>{content}</>;
  }

  return (
    <span
      onClick={() => setExpanded(!expanded)}
      title={expanded ? "Click to collapse" : "Click to expand"}
      style={{
        cursor: "pointer",
        userSelect: "none",
        display: "inline-block",
        whiteSpace: expanded ? "normal" : "nowrap",
        overflow: expanded ? "visible" : "hidden",
        textOverflow: expanded ? "clip" : "ellipsis",
        maxWidth: expanded ? "none" : "200px",
      }}
    >
      {expanded ? content : `${content.slice(0, MAX_LENGTH)}…`}
    </span>
  );
};

export default TruncatedCell;
