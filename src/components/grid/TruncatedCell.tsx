import { useState } from "react";
import parse from "html-react-parser";

const MAX_LENGTH = 50;

const TruncatedCell: React.FC<{ value: any; type: string }> = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  const isHtmlString =
    typeof value === "string" &&
    value.trim().startsWith("<") &&
    value.trim().endsWith(">");

  // Parse only if looks like HTML
  const parsed = isHtmlString ? parse(value) : value;

  // If parsed is a React element (not string), just render it fully, no truncation
  if (!isHtmlString) {
    // Handle plain string or other types with truncation logic

    const plainText = String(value ?? "");

    if (plainText.length <= MAX_LENGTH) {
      return <>{plainText}</>;
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
        {expanded ? plainText : `${plainText.slice(0, MAX_LENGTH)}…`}
      </span>
    );
  }

  // For HTML string (parsed React element), render fully with no truncation
  return <>{parsed}</>;
};

export default TruncatedCell;
