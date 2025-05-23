type WaiverToken = { type: string; id?: string };
type ParsedContent = (string | WaiverToken)[];

export function parseWaiverTemplate(template: string): ParsedContent {
  //dynamic fields
  const regex = /{{(name|signature|date)(?::(\d+))?}}/g;

  const result: ParsedContent = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    const [fullMatch, type, id] = match;
    const matchStart = match.index;

    // Push preceding text
    if (lastIndex < matchStart) {
      result.push(template.slice(lastIndex, matchStart));
    }

    // Push token
    result.push({ type, id });

    lastIndex = match.index + fullMatch.length;
  }

  // Push remaining text
  if (lastIndex < template.length) {
    result.push(template.slice(lastIndex));
  }

  return result;
}