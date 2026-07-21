const fs = require("fs");
const path = require("path");

const root = __dirname;
const thoughtsDir = path.join(root, "thoughts");
const indexPath = path.join(root, "index.html");

const START = "<!-- thoughts:start -->";
const END = "<!-- thoughts:end -->";
const MARKER = "<!-- excerpt -->";

// Anything that belongs only on the full page, never in the landing-page excerpt.
function stripTail(html) {
  return html
    .replace(/<div class="meta">[\s\S]*?<\/div>/g, "")
    .replace(/<p class="note">[\s\S]*?<\/p>/g, "")
    .trim();
}

function hasContent(html) {
  return stripTail(html).replace(/<[^>]*>/g, "").trim().length > 0;
}

// Without an explicit marker, fall back to the title, subtitle, and first paragraph.
function leadingBlocks(inner) {
  const blocks = inner.match(/<(h2|p)\b[\s\S]*?<\/\1>/g) || [];
  const kept = [];
  for (const block of blocks) {
    kept.push(block);
    const isHeading = block.startsWith("<h2");
    const isSubtitle = block.includes('class="subtitle"');
    if (!isHeading && !isSubtitle) break;
  }
  return { body: kept.join("\n\n"), truncated: kept.length < blocks.length };
}

function readThought(file) {
  const slug = path.basename(file, ".html");
  const html = fs.readFileSync(path.join(thoughtsDir, file), "utf8");

  const article = html.match(/<article class="thought">([\s\S]*?)<\/article>/);
  if (!article) throw new Error(`${file}: no <article class="thought"> block`);
  const inner = article[1];

  const time = inner.match(/<time datetime="([^"]+)">([^<]*)<\/time>/);
  if (!time) throw new Error(`${file}: no <time datetime="..."> inside the article`);

  const cut = inner.indexOf(MARKER);
  const { body, truncated } =
    cut === -1
      ? leadingBlocks(inner)
      : { body: stripTail(inner.slice(0, cut)), truncated: hasContent(inner.slice(cut + MARKER.length)) };

  if (!body) throw new Error(`${file}: excerpt is empty — is there content before ${MARKER}?`);

  const href = `thoughts/${slug}.html`;
  const linkedTitle = body.replace(
    /<h2>([\s\S]*?)<\/h2>/,
    `<h2><a href="${href}">$1</a></h2>`
  );

  const indented = linkedTitle
    .split("\n")
    .map((line) => (line.trim() ? `  ${line.trim()}` : ""))
    .join("\n");

  // Always link out, or a short untruncated thought would have no route to its own page.
  const more = `\n    <a href="${href}">${truncated ? "read more" : "permalink"}</a>`;

  return {
    slug,
    date: time[1],
    html: [
      '<article class="thought">',
      indented,
      '  <div class="meta">',
      `    <time datetime="${time[1]}">${time[2]}</time>${more}`,
      "  </div>",
      "</article>",
    ].join("\n"),
  };
}

const thoughts = fs
  .readdirSync(thoughtsDir)
  .filter((f) => f.endsWith(".html") && !f.startsWith("_"))
  .map(readThought)
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

const index = fs.readFileSync(indexPath, "utf8");
const start = index.indexOf(START);
const end = index.indexOf(END);
if (start === -1 || end === -1) {
  throw new Error(`index.html is missing the ${START} / ${END} markers`);
}

const body = thoughts.map((t) => t.html).join("\n\n");
const updated =
  index.slice(0, start + START.length) + "\n\n" + body + "\n\n" + index.slice(end);

fs.writeFileSync(indexPath, updated);
console.log(`index.html — ${thoughts.length} thought${thoughts.length === 1 ? "" : "s"}`);
