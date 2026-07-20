const fs = require("fs");
const path = require("path");

const root = __dirname;
const thoughtsDir = path.join(root, "thoughts");
const indexPath = path.join(root, "index.html");

const START = "<!-- thoughts:start -->";
const END = "<!-- thoughts:end -->";

function readThought(file) {
  const slug = path.basename(file, ".html");
  const html = fs.readFileSync(path.join(thoughtsDir, file), "utf8");

  const article = html.match(/<article class="thought">[\s\S]*?<\/article>/);
  if (!article) throw new Error(`${file}: no <article class="thought"> block`);

  const date = article[0].match(/<time datetime="([^"]+)"/);
  if (!date) throw new Error(`${file}: no <time datetime="..."> inside the article`);

  const meta = article[0].match(/<div class="meta">[\s\S]*?<\/div>/);
  if (!meta) throw new Error(`${file}: no <div class="meta"> inside the article`);

  const linked = meta[0]
    .replace(/\s*<a href="thoughts\/[^"]*"[^>]*>.*?<\/a>/g, "")
    .replace(/\s*<\/div>$/, `\n    <a href="thoughts/${slug}.html">permalink</a>\n  </div>`);

  return { slug, date: date[1], html: article[0].replace(meta[0], linked) };
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
