type WaiverToken = {
  type: string;        // e.g., "name", "signature", "date", "input"
  id?: string;         // optional subtype or identifier (e.g., "boardModel")
};

type ParsedContent = (string | WaiverToken)[];


export function parseWaiverTemplate(template: string): ParsedContent {
  const regex = /{{(name|signature|date|input)(?::([\w-]+))?}}/g;

  const result: ParsedContent = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    // match[1] = type, match[2] = id/subtype
    const type = match[1];
    const id = match[2];
    const matchStart = match.index;

    if (lastIndex < matchStart) {
      result.push(template.slice(lastIndex, matchStart));
    }

    result.push({ type, id });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < template.length) {
    result.push(template.slice(lastIndex));
  }

  return result;
}

