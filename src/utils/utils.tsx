type WaiverToken = {
  type: string;        // e.g., "name", "signature", "date", "input"
  id: number;         // count of this type in the waiver string (1-based)
  subtype?: string | null;  // optional subtype or identifier (e.g., "boardModel")
};

type ParsedContent = (string | WaiverToken)[];

export function parseWaiverTemplate(template: string): ParsedContent {
  const regex = /{{(name|signature|date|input)(?::([\w-]+))?}}/g;

  const result: ParsedContent = [];
  let lastIndex = 0;
  // Track count of each type for id assignment
  const typeCounts: { [key: string]: number } = {
    name: 0,
    signature: 0,
    date: 0,
    input: 0,
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    // match[1] = type, match[2] = subtype
    const type = match[1];
    const subtype = match[2] || null; // Use null if subtype is undefined
    const matchStart = match.index;

    // Increment the count for this type and assign as id
    typeCounts[type]++;
    const id = typeCounts[type];

    // Add any preceding text as a string
    if (lastIndex < matchStart) {
      result.push(template.slice(lastIndex, matchStart));
    }

    // Add the WaiverToken with type, id, and subtype
    result.push({ type, id, subtype });

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < template.length) {
    result.push(template.slice(lastIndex));
  }

  return result;
}

