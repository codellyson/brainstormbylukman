# brainstormbylukman

Thoughts, one per entry. Built with [Hugo](https://gohugo.io).

## Adding a thought

```sh
hugo new content thoughts/some-slug.md
```

Fill in the front matter, write in markdown, and put `<!--more-->` where the landing page
should cut off. Everything above the marker becomes the excerpt; below it stays on the
thought's own page.

Wrap a closing aside in `{{< note >}}…{{< /note >}}` to get the muted, separated styling.

## Local preview

```sh
hugo server -D
```

Serves at http://localhost:1313 with live reload. `-D` includes drafts.

## Deploying

Push to `master`. GitHub Actions builds with Hugo and publishes to Pages —
https://codellyson.github.io/brainstormbylukman/

## Layout

- `content/thoughts/*.md` — the thoughts
- `layouts/baseof.html` — page shell
- `layouts/home.html` — landing page, excerpts of every thought, newest first
- `layouts/page.html` — a single thought
- `layouts/section.html` — the `/thoughts/` archive listing
- `layouts/_shortcodes/note.html` — the `{{< note >}}` shortcode
- `static/style.css` — all the styling
