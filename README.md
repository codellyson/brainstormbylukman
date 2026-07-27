# thoughts by lukman

Thoughts, one per entry. Built with [Hugo](https://gohugo.io).
Live at https://thoughtsbylukman.kreativekorna.com

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
https://thoughtsbylukman.kreativekorna.com

## Post over the air (from phone or browser)

Use **Issues** to publish, edit, or unpublish without cloning the repo:

### Publish

1. Open **New issue** and choose **Publish thought** (or add the `publish` label manually).
2. Paste a ` ```json ... ``` ` payload.
3. Submit the issue.

What happens automatically:
- A workflow creates `content/thoughts/<slug>.md` from the issue.
- It commits to `master`.
- Deploy runs and publishes the post.
- The issue is commented, labeled `published`, and closed.

Payload format:

```json
{
  "title": "Your thought title",
  "subtitle": "Optional subtitle",
  "description": "Optional short SEO description",
  "slug": "optional-custom-slug",
  "date": "2026-07-27",
  "aliases": ["/thoughts/your-slug.html"],
  "content": "Write your markdown content here.\n\nUse \\n for line breaks."
}
```

### Edit

1. Open **New issue** and choose **Edit thought** (or add `edit-post` label manually).
2. Use this JSON payload format:

```json
{
  "slug": "existing-thought-slug",
  "title": "Updated title",
  "subtitle": "Optional new subtitle",
  "description": "Optional new description",
  "date": "2026-07-27",
  "aliases": ["/thoughts/existing-thought-slug.html"],
  "content": "Full updated markdown content.\n\nUse \\n for line breaks."
}
```

3. Submit the issue.

What happens automatically:
- The matching `content/thoughts/<slug>.md` file is updated.
- A commit is pushed to `master`.
- Deploy republishes the edited post.
- The issue is commented, labeled `edited-post`, and closed.

Note: edit is strict and replaces the full post file content.

### Unpublish

1. Open **New issue** and choose **Unpublish thought** (or add `unpublish-post` label manually).
2. Paste JSON like:

```json
{
  "slug": "attack-on-titan-propaganda"
}
```

3. Submit the issue.

What happens automatically:
- `content/thoughts/<slug>.md` is removed.
- A commit is pushed to `master`.
- Deploy removes the post from the live site.
- The issue is commented, labeled `unpublished-post`, and closed.

## Layout

- `content/thoughts/*.md` — the thoughts
- `layouts/baseof.html` — page shell
- `layouts/home.html` — landing page, excerpts of every thought, newest first
- `layouts/page.html` — a single thought
- `layouts/section.html` — the `/thoughts/` archive listing
- `layouts/_shortcodes/note.html` — the `{{< note >}}` shortcode
- `static/style.css` — all the styling
