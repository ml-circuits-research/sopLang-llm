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

Use a paragraph beginning `Table N.` immediately before its table, and `Figure N.` immediately after its image. Captions remain editable Word paragraphs. Numeric results belong in the source or generated tables and must be independently audited; the builder only preserves them. For two-column articles, the title, abstract, and keywords remain full-width; the body begins at the first numbered heading after keywords. Margins and column spacing can match a verified template. This is manuscript formatting, not a claim that the publisher approved the layout.

Supported citation styles are `author-date`, `numbered`, and `springer-numbered`; the latter places the year after the entry text. Bibliography entries without a URL are permitted when the source is a clearly identified local supplement, but the target journal may require an actual public deposit before submission. The builder cannot establish that a source exists or is published.

Optional layout fields include `captionStyle: "springer"` for bold `Fig. N` captions, `headerRight`, `keepTablesTogether`, `keepReferencesTogether`, `maxFigureHeight` in twips, and `tableWeights` keyed by the pipe-joined header cells. Keep-together settings are appropriate only for blocks that fit a page or column. Always inspect rendered pages.

An optional `template` path imports the official template's paragraph styles. `styleMap` maps builder roles such as `Normal`, `Title`, `Heading1`, `Abstract`, `Keywords`, and `Caption` to the template's style IDs. Template automatic numbering is removed because manuscript headings and references are explicitly numbered. The output omits template macros, author metadata, and publication placeholders. The build manifest records the template hash. Use `frontMatter: "keywords-before-abstract"` and `hideAbstractHeading: true` only when the verified template requires that order. Importing styles does not automatically satisfy every template field or publisher rule.

Unknown Markdown features are not silently promised. Add support or simplify the source when a journal requires footnotes, complex equations, tracked changes, or elaborate template-specific objects. Human identity and declarations must come from supplied facts, not document properties inferred by the builder.
