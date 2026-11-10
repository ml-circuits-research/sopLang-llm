export function escapeXml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
export function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const blocks = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }
    if (/^<!--/.test(line)) { index++; continue; }
    if (/^```/.test(line)) {
      const code = [];
      index++;
      while (index < lines.length && !/^```/.test(lines[index])) code.push(lines[index++]);
      if (index === lines.length) throw new Error('Unclosed Markdown code fence');
      index++;
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }
    const heading = /^(#{1,4}) (.+)$/.exec(line);
    if (heading) { blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] }); index++; continue; }
    const figure = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
    if (figure) { blocks.push({ type: 'figure', alt: figure[1], path: figure[2] }); index++; continue; }
    if (/^\|/.test(line)) {
      const rows = [];
      while (index < lines.length && /^\|/.test(lines[index])) {
        const cells = lines[index++].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
        if (!cells.every(cell => /^:?-+:?$/.test(cell))) rows.push(cells);
      }
      if (!rows.length || rows.some(row => row.length !== rows[0].length)) throw new Error('Invalid table');
      blocks.push({ type: 'table', rows });
      continue;
    }
    // A block quote: consecutive lines starting with ">"; a line holding only ">" separates its paragraphs.
    if (/^>/.test(line)) {
      const paragraphs = [];
      let current = [];
      while (index < lines.length && /^>/.test(lines[index])) {
        const content = lines[index++].replace(/^>\s?/, '');
        if (content.trim()) current.push(content.trim());
        else if (current.length) { paragraphs.push(current.join(' ')); current = []; }
      }
      if (current.length) paragraphs.push(current.join(' '));
      blocks.push({ type: 'quote', paragraphs });
      continue;
    }
    const item = /^(-|\d{1,2}\.) (.*)$/;
    if (item.test(line)) {
      const ordered = /^\d/.test(line), items = [];
      while (index < lines.length && item.test(lines[index])) {
        const parts = [item.exec(lines[index++])[2]];
        while (index < lines.length && lines[index].trim() && !item.test(lines[index]) && !/^(#|\||```|!\[|<!--|>)/.test(lines[index])) parts.push(lines[index++].trim());
        items.push(parts.join(' '));
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    const text = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !/^(#|\||```|!\[|<!--|- |\d{1,2}\. |>)/.test(lines[index])) text.push(lines[index++]);
    blocks.push({ type: 'paragraph', text: text.join(' ') });
  }
  return blocks;
}
export function renderCitations(source, references, style = 'author-date') {
  if (!['author-date', 'numbered', 'springer-numbered'].includes(style)) throw new Error(`Unknown citation style: ${style}`);
  const numbered = style !== 'author-date';
  // A citation is one or more keys: [@key] or [@first; @second].
  const citation = /\[@([a-z0-9-]+(?:;\s*@[a-z0-9-]+)*)\]/g;
  const keysOf = group => group.split(/;\s*@/);
  const keys = [...new Set([...source.matchAll(citation)].flatMap(match => keysOf(match[1])))];
  for (const key of keys) if (!references[key]) throw new Error(`Unknown reference: ${key}`);
  const order = numbered ? keys : keys.sort((a, b) =>
    references[a].sort.localeCompare(references[b].sort));
  const number = new Map(order.map((key, index) => [key, index + 1]));
  let markdown = source.replace(citation, (_, group) => numbered
    ? `[${keysOf(group).map(key => number.get(key)).sort((a, b) => a - b).join(', ')}]`
    : `(${keysOf(group).map(key => references[key].citation).join('; ')})`);
  const bibliography = order.map(key => {
    const ref = references[key];
    const url = ref.doi ? 'https://doi.org/' + ref.doi : ref.url;
    const entry = style === 'springer-numbered' ? ref.entry.replace(/^(.+?) \((\d{4})\)\. (.+)\.$/, '$1: $3 ($2).') : ref.entry;
    return `${numbered ? `[${number.get(key)}] ` : ''}${entry}${url ? ` [${url}](${url})` : ''}`;
  }).join('\n\n');
  markdown = markdown.replace('<!-- REFERENCES -->', `## References\n\n${bibliography}`);
  if (!source.includes('<!-- REFERENCES -->')) throw new Error('Missing references marker');
  return { markdown, references: order };
}
