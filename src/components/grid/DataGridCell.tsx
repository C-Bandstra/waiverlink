import React, { useState } from "react";
import type { FirestoreValue } from "../../types/admin";
import { renderValue } from "../../utils/helpers";

interface DataGridCellProps {
  value: FirestoreValue | React.ReactNode; // FirestoreValue or ReactNode
  type: string;
}

const MAX_LENGTH = 50;

const DataGridCell: React.FC<DataGridCellProps> = ({ value, type }) => {
  const [expanded, setExpanded] = useState(false);


  // Use renderValue utility to get either parsed React element or clean string
  const rendered = renderValue(value, type);

  // If the returned result is a valid React element (e.g., parsed signature), render it directly
  if (React.isValidElement(rendered)) {
    return <>{rendered}</>;
  }

  // Otherwise, treat it as a string and apply truncation logic
  const text = String(rendered ?? "");


  if (text.length <= MAX_LENGTH) {
    return <>{text}</>;
  }

  // Truncate with toggle expand/collapse
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
      {expanded ? text : `${text.slice(0, MAX_LENGTH)}…`}
    </span>
  );
};

export default DataGridCell;
