import type { WaiverToken } from "../types";

type ParsedContent = (string | WaiverToken)[];

export function parseWaiverTemplate(template: string): ParsedContent {
  const regex = /{{(name|signature|date|input|checkbox|radio|dropdown|textarea|br)(?::([^}]+))?}}/g;

  const chunks: ParsedContent = [];
  let lastIndex = 0;

  const typeCounts: { [key: string]: number } = {
    name: 0,
    signature: 0,
    date: 0,
    input: 0,
    checkbox: 0,
    radio: 0,
    dropdown: 0,
    textarea: 0,
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    const type = match[1];
    const subtype = match[2] || null; // Use null if subtype is undefined
    const matchStart = match.index;

    // Increment the count for this type and assign as id
    typeCounts[type]++;
    const id = typeCounts[type];

    // Add any preceding text as a string
    if (lastIndex < matchStart) {
      chunks.push(template.slice(lastIndex, matchStart));
    }

    // Add the WaiverToken with type, id, and subtype
    chunks.push({ type, id, subtype });

    lastIndex = regex.lastIndex;
  }

    // Add any remaining text after the last match
  if (lastIndex < template.length) {
    chunks.push(template.slice(lastIndex));
  }

  return chunks;
}

export function parseSubtype(subtype: string | null | undefined) {
    //could use null return object to manipulate outside template definition
  if (!subtype) return { fieldName: null, options: [], label: null };

  const [main, labelPart] = subtype.split(';'); // split once at semicolon
  const [fieldName, ...options] = main.split(':');

  return {
    fieldName: fieldName.trim(),
    options: options.map(o => o.trim()),
    label: labelPart?.trim() ?? null
  };
}
