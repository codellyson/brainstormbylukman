# brainstormbylukman

Thoughts, one per entry. Plain HTML — open `index.html` to view, no server needed.

## Adding a thought

1. Copy `thoughts/_template.html` to `thoughts/<slug>.html` and fill in the title, text, and date.
2. Put `<!-- excerpt -->` where the landing page should cut off.
3. Run `node build.js`.

The landing page is regenerated from the `thoughts/` folder, newest first by the `<time datetime>`
value. Don't edit the thought list in `index.html` by hand — it gets overwritten.

## Excerpts

Only the content *above* `<!-- excerpt -->` goes on the landing page, followed by a "read more"
link. Without the marker, the excerpt falls back to the title, subtitle, and first paragraph.

Short thoughts can skip the marker entirely — if nothing was cut, the link reads "permalink"
instead, so every thought is still reachable from the landing page.

## Files

- `thoughts/<slug>.html` — one page per thought, the source of truth
- `index.html` — landing page, generated between the `thoughts:start` / `thoughts:end` markers
- `build.js` — regenerates that list; no dependencies
- `style.css` — shared by all pages
