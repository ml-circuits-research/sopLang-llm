import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, relative, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { zip, unzip } from './zip.mjs';
import { escapeXml as x, parseMarkdown, renderCitations } from './markdown.mjs';

const wns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const rns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
function relationship(id, type, target, external = false) {
  return `<Relationship Id="${id}" Type="${rns}/${type}" Target="${x(target)}"${external ? ' TargetMode="External"' : ''}/>`;
}
function relations(contents) {
  return declaration + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + contents + '</Relationships>';
}
function run(text, properties = '') {
  return `<w:r>${properties ? `<w:rPr>${properties}</w:rPr>` : ''}<w:t xml:space="preserve">${x(text)}</w:t></w:r>`;
}
function makeStyles(job) {
  const size = (job.fontSize ?? 11) * 2;
  const style = (id, name, properties = '', p = '') =>
    `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:pPr>${p}</w:pPr><w:rPr>${properties}</w:rPr></w:style>`;
  return declaration + `<w:styles xmlns:w="${wns}">
    <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="${job.lineSpacing ?? 276}" w:lineRule="auto"/><w:widowControl/></w:pPr></w:pPrDefault></w:docDefaults>
    <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:jc w:val="both"/></w:pPr></w:style>
    ${style('Title', 'Title', '<w:b/><w:sz w:val="32"/>', '<w:keepNext/><w:spacing w:before="160" w:after="240"/><w:jc w:val="left"/>')}
    ${[1, 2, 3].map(level => style(`Heading${level}`, `heading ${level}`, `<w:b/><w:sz w:val="${level === 1 ? 26 : 23}"/>`, `<w:keepNext/><w:keepLines/><w:spacing w:before="240" w:after="100"/><w:outlineLvl w:val="${level - 1}"/><w:jc w:val="left"/>`)).join('')}
    ${style('Caption', 'Caption', '<w:sz w:val="19"/>', '<w:keepLines/><w:spacing w:before="80" w:after="160"/><w:jc w:val="left"/>')}
    ${style('TableText', 'Table text', `<w:sz w:val="${job.columns === 2 ? 17 : 19}"/>`, '<w:spacing w:before="25" w:after="45" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>')}
    ${style('Code', 'Code', '<w:rFonts w:ascii="Liberation Mono" w:hAnsi="Liberation Mono"/><w:sz w:val="17"/>', '<w:spacing w:before="0" w:after="0" w:line="230" w:lineRule="auto"/><w:shd w:fill="F4F4F4"/><w:jc w:val="left"/>')}
    ${style('Reference', 'Reference', `<w:sz w:val="${size - 1}"/>`, '<w:ind w:left="260" w:hanging="260"/><w:spacing w:after="120"/><w:jc w:val="left"/>')}
    ${style('Header', 'Header', '<w:sz w:val="17"/><w:color w:val="555555"/>', '<w:spacing w:after="60"/><w:jc w:val="left"/>')}
    </w:styles>`;
}
export async function buildDocx(jobPath) {
  if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('Node.js 20 or later is required.');
  const base = dirname(resolve(jobPath));
  const job = JSON.parse(await readFile(resolve(jobPath), 'utf8'));
  const sourcePath = resolve(base, job.source);
  const outputPath = resolve(base, job.output);
  const source = await readFile(sourcePath, 'utf8');
  const references = JSON.parse(await readFile(resolve(base, job.bibliography), 'utf8'));
  const rendered = renderCitations(source, references, job.citationStyle);
  if (job.captionStyle === 'springer') {
    rendered.markdown = rendered.markdown.replace(/^Figure (\d+)\. (.+)$/gm,
      (_, number, caption) => `**Fig. ${number}** ${caption.replace(/\.$/, '')}`);
  }
  const blocks = parseMarkdown(rendered.markdown);
  if (job.frontMatter === 'keywords-before-abstract') {
    const index = blocks.findIndex(block => block.type === 'paragraph' && /^Keywords:/.test(block.text));
    if (index >= 0) blocks.splice(1, 0, blocks.splice(index, 1)[0]);
  }
  const title = blocks.find(block => block.type === 'heading' && block.level === 1)?.text;
  if (!title) throw new Error('A manuscript must start with a title.');
  const files = {};
  let templateStyles, templateHash;
  if (job.template) {
    const bytes = await readFile(resolve(base, job.template));
    const template = unzip(bytes);
    templateHash = createHash('sha256').update(bytes).digest('hex');
    templateStyles = template['word/styles.xml']?.toString();
    if (!templateStyles) throw new Error('Template has no word/styles.xml');
  }
  const rels = [relationship('styles', 'styles', 'styles.xml'),
    relationship('header', 'header', 'header1.xml'), relationship('footer', 'footer', 'footer1.xml')];
  let linkNumber = 0, imageNumber = 0;
  const imagePaths = [];
  function inline(text) {
    const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    const result = [];
    let offset = 0;
    for (const match of text.matchAll(pattern)) {
      result.push(run(text.slice(offset, match.index)));
      if (match[2]) {
        const id = `link${++linkNumber}`;
        rels.push(relationship(id, 'hyperlink', match[3], true));
        result.push(`<w:hyperlink r:id="${id}">${run(match[2], '<w:color w:val="174F79"/><w:u w:val="single"/>')}</w:hyperlink>`);
      } else if (match[4]) result.push(run(match[4], '<w:rFonts w:ascii="Liberation Mono" w:hAnsi="Liberation Mono"/><w:sz w:val="19"/>'));
      else result.push(run(match[5] ?? match[6], match[5] ? '<w:b/>' : '<w:i/>'));
      offset = match.index + match[0].length;
    }
    result.push(run(text.slice(offset)));
    return result.join('');
  }
  function paragraph(text, style = 'Normal', extras = '') {
    const mapped = job.styleMap?.[style] ?? style;
    return `<w:p><w:pPr><w:pStyle w:val="${mapped}"/>${extras}</w:pPr>${inline(text)}</w:p>`;
  }
  const margin = { top: 1440, right: 1440, bottom: 1440, left: 1440, ...job.margins };
  const pageWidth = 11906, pageHeight = 16838;
  const bodyWidth = pageWidth - margin.left - margin.right;
  const columnWidth = job.columns === 2 ? (bodyWidth - (job.columnSpace ?? 284)) / 2 : bodyWidth;
  function section(columns, continuous = false) {
    return `<w:sectPr><w:headerReference w:type="default" r:id="header"/><w:footerReference w:type="default" r:id="footer"/>${continuous ? '<w:type w:val="continuous"/>' : ''}<w:pgSz w:w="${pageWidth}" w:h="${pageHeight}"/><w:pgMar w:top="${margin.top}" w:right="${margin.right}" w:bottom="${margin.bottom}" w:left="${margin.left}" w:header="600" w:footer="600" w:gutter="0"/><w:cols w:num="${columns}" w:space="${job.columnSpace ?? 284}"/></w:sectPr>`;
  }
  function table(rows) {
    const weights = job.tableWeights?.[rows[0].join('|')] ?? rows[0].map(() => 1);
    const sum = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map(value => Math.round(columnWidth * value / sum));
    const borders = '<w:tblBorders><w:top w:val="single" w:sz="8" w:color="333333"/><w:bottom w:val="single" w:sz="8" w:color="333333"/><w:insideH w:val="single" w:sz="4" w:color="BBBBBB"/></w:tblBorders>';
    const props = `<w:tblPr><w:tblW w:w="${Math.round(columnWidth)}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${borders}<w:tblCellMar><w:top w:w="65" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="65" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr>`;
    return `<w:tbl>${props}<w:tblGrid>${widths.map(width => `<w:gridCol w:w="${width}"/>`).join('')}</w:tblGrid>${rows.map((row, index) =>
      `<w:tr><w:trPr><w:cantSplit/>${index === 0 ? '<w:tblHeader/>' : ''}</w:trPr>${row.map((cell, col) => `<w:tc><w:tcPr><w:tcW w:w="${widths[col]}" w:type="dxa"/>${index === 0 ? '<w:shd w:fill="EAEAEA"/>' : ''}</w:tcPr>${paragraph(index === 0 ? `**${cell}**` : cell, 'TableText', job.keepTablesTogether && index < rows.length - 1 ? '<w:keepNext/>' : '')}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>${paragraph('', 'Normal', '<w:spacing w:after="40"/>')}`;
  }
  async function figure(block) {
    const path = resolve(dirname(sourcePath), block.path);
    const bytes = await readFile(path);
    if (bytes.subarray(1, 4).toString() !== 'PNG') throw new Error(`PNG required: ${path}`);
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    const id = `image${++imageNumber}`;
    const maxHeight = job.maxFigureHeight ?? (job.columns === 2 ? 6500 : 6200);
    const drawWidth = Math.min(columnWidth, maxHeight * width / height);
    const cx = Math.round(drawWidth * 635), cy = Math.round(drawWidth * height / width * 635);
    files[`word/media/${id}.png`] = bytes;
    rels.push(relationship(id, 'image', `media/${id}.png`));
    imagePaths.push({ source: relative(base, path), width, height,
      sha256: createHash('sha256').update(bytes).digest('hex') });
    return `<w:p><w:pPr><w:keepNext/><w:jc w:val="center"/><w:spacing w:before="180" w:after="40"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${imageNumber}" name="Figure ${imageNumber}" descr="${x(block.alt)}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${imageNumber}" name="${id}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
  }
  const body = [];
  let inReferences = false, afterKeywords = false, splitColumns = false, inAbstract = false;
  for (const block of blocks) {
    if (job.columns === 2 && afterKeywords && block.type === 'heading' && /^\d+\./.test(block.text) && !splitColumns) {
      body.push(`<w:p><w:pPr>${section(1, true)}</w:pPr></w:p>`);
      splitColumns = true;
    }
    if (block.type === 'heading') {
      inReferences ||= block.text === 'References';
      inAbstract = block.text === 'Abstract';
      if (inAbstract && job.hideAbstractHeading) continue;
      body.push(paragraph(block.text, block.level === 1 ? 'Title' : `Heading${block.level - 1}`));
    } else if (block.type === 'paragraph') {
      const caption = /^(Figure|Table) \d+\.|^\*\*Fig\. \d+\*\*/.test(block.text);
      const isTable = /^Table \d+\./.test(block.text);
      const isKeywords = /^Keywords:/.test(block.text);
      const style = inReferences ? 'Reference' : caption ? 'Caption' : isKeywords
        ? (job.styleMap?.Keywords ? 'Keywords' : 'Normal') : inAbstract && job.styleMap?.Abstract ? 'Abstract' : 'Normal';
      body.push(paragraph(block.text, style, isTable ? '<w:keepNext/>' : ''));
      if (/^Keywords:/.test(block.text)) afterKeywords = true;
    } else if (block.type === 'table') body.push(table(block.rows));
    else if (block.type === 'figure') body.push(await figure(block));
    else if (block.type === 'code') {
      const lines = block.text.split('\n');
      lines.forEach((line, index) => body.push(paragraph(line, 'Code',
        index < lines.length - 1 ? '<w:keepNext/>' : '<w:spacing w:after="180"/>')));
    }
  }
  files['word/document.xml'] = declaration + `<w:document xmlns:w="${wns}" xmlns:r="${rns}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body.join('')}${section(job.columns ?? 1, splitColumns)}</w:body></w:document>`;
  let styles = makeStyles(job);
  if (templateStyles) {
    const added = styles.match(/<w:style\b[\s\S]*?<\/w:style>/g).join('');
    const defaults = styles.match(/<w:docDefaults>[\s\S]*?<\/w:docDefaults>/)[0];
    // Keep the official paragraph definitions. Explicit source numbering replaces
    // template auto-numbering, avoiding duplicate heading/reference numbers.
    styles = templateStyles.replace(/<w:numPr>[\s\S]*?<\/w:numPr>/g, '')
      .replace(/ w:default="1"/g, '').replace(/<w:docDefaults>[\s\S]*?<\/w:docDefaults>/, defaults)
      .replace(/w:val="sl-SI"/g, 'w:val="en-US"').replace('</w:styles>', added + '</w:styles>');
  }
  files['word/styles.xml'] = styles;
  files['word/header1.xml'] = declaration + `<w:hdr xmlns:w="${wns}" xmlns:r="${rns}"><w:p><w:pPr><w:pStyle w:val="Header"/><w:tabs><w:tab w:val="right" w:pos="${bodyWidth}"/></w:tabs></w:pPr>${inline(job.shortTitle ?? title)}${job.headerRight ? '<w:r><w:tab/></w:r>' + run(job.headerRight) : ''}</w:p></w:hdr>`;
  files['word/footer1.xml'] = declaration + `<w:ftr xmlns:w="${wns}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText>PAGE</w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
  files['word/_rels/document.xml.rels'] = relations(rels.join(''));
  files['_rels/.rels'] = relations(relationship('document', 'officeDocument', 'word/document.xml')
    + '<Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>');
  files['docProps/core.xml'] = declaration + `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${x(title)}</dc:title><dc:subject>${x(job.journal ?? '')}</dc:subject><dc:description>Editable research manuscript; journal adaptation.</dc:description></cp:coreProperties>`;
  files['[Content_Types].xml'] = declaration + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/>'
    + [['/word/document.xml', 'document.main'], ['/word/styles.xml', 'styles'], ['/word/header1.xml', 'header'], ['/word/footer1.xml', 'footer']]
      .map(([part, type]) => `<Override PartName="${part}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"/>`).join('')
    + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>';
  const archive = zip(files);
  const checked = unzip(archive);
  if (Object.keys(checked).length !== Object.keys(files).length) throw new Error('DOCX ZIP validation failed');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, archive);
  const finalMarkdown = rendered.markdown.replace(/^!\[([^\]]*)\]\(([^)]+)\)$/gm,
    (_, alt, path) => `![${alt}](${relative(dirname(outputPath), resolve(dirname(sourcePath), path))})`);
  await writeFile(outputPath.replace(/\.docx$/, '.md'), finalMarkdown);
  const manifest = { file: basename(outputPath), journal: job.journal,
    source: relative(base, sourcePath), sha256: createHash('sha256').update(archive).digest('hex'),
    sourceSha256: createHash('sha256').update(source).digest('hex'),
    words: finalMarkdown.split(/\s+/).length, references: rendered.references,
    tables: blocks.filter(block => block.type === 'table').length, templateSha256: templateHash,
    figures: imagePaths, columns: job.columns ?? 1, zipMembers: Object.keys(checked).length };
  await writeFile(outputPath.replace(/\.docx$/, '.build.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) { console.error('Usage: node build-docx.mjs /path/job.json'); process.exitCode = 1; }
  else console.log(JSON.stringify(await buildDocx(process.argv[2]), null, 2));
}
