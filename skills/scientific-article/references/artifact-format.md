# DOCX builder format

Run `node scripts/build-docx.mjs /absolute/path/job.json`. Paths inside the JSON job are resolved relative to that job. The builder writes DOCX, resolved Markdown, and a build manifest beside `output`.

```json
{
  "source": "../manuscripts/paper.md",
  "output": "../docs/paper.docx",
  "bibliography": "../evidence/bibliography.json",
  "journal": "Verified target journal",
  "shortTitle": "Short descriptive running title",
  "fontSize": 11,
  "lineSpacing": 276,
  "citationStyle": "author-date",
  "columns": 1,
  "margins": { "top": 1440, "right": 1440, "bottom": 1440, "left": 1440 }
}
```

Markdown supports headings through level four, paragraphs, fenced code, rectangular pipe tables, links, bold, italic, inline code, and standalone images. Source citations use `[@key]`; put `<!-- REFERENCES -->` where the reference list belongs. Bibliography JSON maps keys to `citation`, `sort`, `entry`, `url`, and optional `doi`. The builder resolves citations and includes exactly the cited entries. Figure paths are relative to the source Markdown; PNG dimensions determine the aspect ratio. SVG sources can be kept alongside their PNGs, but the supplied figure path must be PNG for broadly compatible Word rendering.

Use a paragraph beginning `Table N.` immediately before its table, and `Figure N.` immediately after its image. Captions remain editable Word paragraphs. Numeric results belong in the source or generated tables and must be independently audited; the builder only preserves them. For two-column articles, the title, abstract, and keywords remain full-width; the body begins at the first heading after keywords. Margins and column spacing can match a verified template. This is manuscript formatting, not a claim that the publisher approved the layout.

Unknown Markdown features are not silently promised. Add support or simplify the source when a journal requires footnotes, complex equations, tracked changes, or elaborate template-specific objects. Human identity and declarations must come from supplied facts, not document properties inferred by the builder.
