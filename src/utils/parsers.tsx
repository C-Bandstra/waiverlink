import type { WaiverToken } from "../types";

type ParsedContent = (string | WaiverToken)[];

/**
 * Parses a waiver template string and returns an array of content chunks.
 * Each chunk is either a plain text string or a structured WaiverToken object.
 */
export function parseWaiverTemplate(template: string): ParsedContent {
  // Match tokens of the form {{type:subtype|meta}} or variations
  const regex = /{{(name|signature|date|input|checkbox|radio|dropdown|textarea|br)(?::([^|}]+))?(?:\|([^}]+))?}}/g;

  const chunks: ParsedContent = [];
  let lastIndex = 0;

  // Track how many times each type appears to assign unique IDs
  const typeCounts: Record<string, number> = {
    name: 0,
    signature: 0,
    date: 0,
    input: 0,
    checkbox: 0,
    radio: 0,
    dropdown: 0,
    textarea: 0,
    br: 0,
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    const matchStart = match.index;
    const [_fullMatch, type, subtypeRaw, metaRaw] = match;

    // Add any preceding static text as a string chunk
    if (lastIndex < matchStart) {
      const plainText = template.slice(lastIndex, matchStart);
      chunks.push(plainText);
    }

    // Increment count for this token type and assign an ID
    typeCounts[type]++;
    const id = typeCounts[type];

    // Build the token object
    const token: WaiverToken = {
      type,
      id,
    };

    if (subtypeRaw) {
      token.subtype = subtypeRaw.trim();
    }

    if (metaRaw) {
      token.meta = parseMeta(metaRaw);
    }

    chunks.push(token);
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < template.length) {
    const remainingText = template.slice(lastIndex);
    chunks.push(remainingText);
  }

  return chunks;
}

/**
 * Parses a metadata string into a key-value map.
 * Example: "font-size:40px;color:red" => { "font-size": "40px", "color": "red" }
 */
function parseMeta(metaString: string): Record<string, string> {
  const meta: Record<string, string> = {};

  metaString.split(';').forEach(pair => {
    const [rawKey, rawValue] = pair.split(':');
    const key = rawKey?.trim();
    const value = rawValue?.trim();

    if (key && value) {
      meta[key] = value;
    }
  });

  return meta;
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

export function parseFieldId(fieldId: string): WaiverToken {
  const [type, subtypeOrId] = fieldId.split("-");
  const isNumber = !isNaN(Number(subtypeOrId));
  return {
    type,
    id: isNumber ? Number(subtypeOrId) : 1,
    subtype: isNumber ? null : subtypeOrId,
  };
}

export function metaToInlineStyle(meta?: Record<string, string>): React.CSSProperties {
  if (!meta) return {};

  const style: React.CSSProperties = {};

  for (const [key, value] of Object.entries(meta)) {
    // Detect if the key is prefixed with "!" to mean "!important"
    // !!!! important DOES NOT work in inline styling. Extrapolate to element
    //  injection method which can use important keyword from token
    const isImportant = key.startsWith('!');
    const cleanKey = isImportant ? key.slice(1) : key;

    const camelKey = cleanKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    if (camelKey in document.body.style) {
      (style as any)[camelKey] = isImportant ? `${value} !important` : value;
    }
  }

  return style;
}
