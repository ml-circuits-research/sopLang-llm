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
    const text = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !/^(#|\||```|!\[|<!--)/.test(lines[index])) text.push(lines[index++]);
    blocks.push({ type: 'paragraph', text: text.join(' ') });
  }
  return blocks;
}
export function renderCitations(source, references, style = 'author-date') {
  if (!['author-date', 'numbered', 'springer-numbered'].includes(style)) throw new Error(`Unknown citation style: ${style}`);
  const numbered = style !== 'author-date';
  const keys = [...new Set([...source.matchAll(/\[@([a-z0-9-]+)\]/g)].map(match => match[1]))];
  for (const key of keys) if (!references[key]) throw new Error(`Unknown reference: ${key}`);
  const order = numbered ? keys : keys.sort((a, b) =>
    references[a].sort.localeCompare(references[b].sort));
  const number = new Map(order.map((key, index) => [key, index + 1]));
  let markdown = source.replace(/\[@([a-z0-9-]+)\]/g, (_, key) => numbered
    ? `[${number.get(key)}]` : `(${references[key].citation})`);
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
