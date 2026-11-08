# Fikri Budianto — personal website and technical blog

A static Astro + TypeScript site for GitHub Pages. Markdown and MDX content
collections, build-time KaTeX, Shiki code highlighting, locally served fonts,
light/dark themes, a searchable writing index, RSS, sitemap, and social metadata.
There is no production server or runtime connection to Google Drive.

The presentation uses direct section headings, a text-based introduction, and
plain research and project listings. Diagrams are used only to explain technical
methods within research content and articles.

Typography primarily uses locally bundled CMU Sans Serif for interface elements,
introductions, project descriptions, and section headings. CMU Serif (Computer
Modern) is used for research titles, article titles and body text, and quotations.
Article subheadings, tables, captions, and diagrams remain sans serif. Code uses
CMU Typewriter Text; mathematical expressions use KaTeX’s mathematical fonts.

The KaTeX override keeps the renderer and the math plugins on the same patched
version. After dependency updates, run the build verifier to check both MD and
MDX rendering.

## Run locally

Use Node.js 24 LTS (at least 22.12).

```bash
npm install
npm run dev
```

Open the URL printed by Astro, normally `http://127.0.0.1:4321`.

## Build and check

```bash
npm run check
npm run build
npm run verify
npm run preview
```

The deployable output is `dist/`. `verify` checks generated local links and
assets, page metadata, math/code rendering, feed and sitemap output, draft
exclusion, and accidental exposure of editable/private source documents.
It also exercises search, tag filtering, theme persistence and the CV print
button against the generated DOM. These checks do not replace visual browser QA.

Run `npx prettier --write .` to format source files consistently.

## Add a post

Add `src/content/blog/my-post.md` or `my-post.mdx`. Start with the excluded
`_post-template.md` file, rename your copy, and provide this frontmatter:

```yaml
---
title: 'Understanding Abductive Reasoning'
description: 'What additional premises can help establish a conclusion?'
date: 2026-11-08
# updated: 2026-11-10
tags:
  - reasoning
  - neuro-symbolic-ai
draft: false
---
```

`title`, `description`, and `date` are required. `updated` is optional and
must not precede `date`. `tags` defaults to an empty array; `draft` defaults
to false. Drafts are excluded from pages, navigation, RSS, and the sitemap.
Files beginning with `_` are ignored. Dates are formatted in UTC so a
date-only frontmatter value does not shift to the previous day.

Use `$P(y\mid x)$` for inline math and `$$...$$` for display math. KaTeX and
its fonts are bundled locally and equations are rendered at build time.
Fenced code blocks accept language names (`python`, `typescript`, etc.).
GitHub-flavored tables, footnotes, links, and images are supported. Headings
have anchor links; a table of contents appears with three or more second/
third-level headings. Reading time is a simple 220-words/minute estimate.

Keep article images next to the post and reference them with relative paths,
such as `![Description](./images/diagram.png)`. Astro processes local Markdown
images; this avoids hard-coded root paths when using a project repository.
MDX can import Astro components, as shown in the initial reasoning note.

The writing index searches titles, descriptions, and tags entirely in the
browser. With JavaScript disabled, all articles remain accessible.

## Edit content

| What                                                                            | Where                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Name, homepage bio, interests, education, roles, GitHub/LinkedIn, public CV PDF | `src/data/site.ts`                                          |
| Homepage layout and short feature text                                          | `src/pages/index.astro`                                     |
| About narrative                                                                 | `src/pages/about.astro`                                     |
| Research titles and headline results                                            | `src/data/research.ts`                                      |
| Research explanation and diagram                                                | `src/pages/research.astro`, `src/components/Pipeline.astro` |
| Engineering case studies, tags, metrics, public repositories                    | `src/data/projects.ts`                                      |
| Blog posts                                                                      | `src/content/blog/`                                         |
| Global design and article typography                                            | `src/styles/global.css`, `src/styles/prose.css`             |
| Favicon and social artwork                                                      | `public/favicon.svg`, `public/social-card.svg`              |

The CV is a printable HTML page. The Print button also offers Save as PDF
through the browser. To add a reviewed public PDF, place it in `public/` and
set `cvPdf` to a full public URL (or add a base-aware path). No editable DOCX
or private Drive URL is published. Contact links deliberately use the public
GitHub and LinkedIn profiles; no email address or phone number is included.

`npm run build` also generates a 1200 × 630 PNG from the social-card SVG.
The PNG is ignored by Git and rebuilt automatically in GitHub Actions.

The profile photo is stored in `src/assets/fikri-budianto.jpeg` and displayed by
`src/components/Portrait.astro`. Astro generates an optimized WebP during the
build; the original JPEG is not included in the deployed output.

## Content provenance

Omni Solutions case studies are currently marked `draft: true` in the project
data. They are excluded from the homepage, project index, static routes, and
sitemap. The employment entry is retained without project-specific details.

Content was adapted from the AI Engineer CV, the engineering impact tracker,
the hypernetwork manuscript, and the supplied website brief. The brief’s
explicit correction to **B.Sc. Information Systems** overrides the older CV.
No thesis or transcript was located; the thesis methodology and reported
93.5% / 75.9% result over 138 queries come from the supplied brief. The
hypernetwork work is labeled a manuscript; no publication status is inferred.

The public [LinkedIn profile](https://www.linkedin.com/in/fikri-budianto/)
also supplied updated teaching appointments and the graph sentiment-analysis
project. The original degree correction continues to take precedence.

The two initial notes are retained as unpublished drafts for future editing.
They do not appear on the site, have public routes, or enter the RSS feed and
sitemap. Set `draft: false` when ready to publish. Benchmark conditions and
limits are retained. Employer source URLs and client details are omitted.

## Deploy to GitHub Pages

1. Push the source to the `main` branch of your GitHub repository.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. The included workflow installs dependencies with `npm ci`, checks types,
   builds and verifies the output, then deploys `dist/`. Subsequent pushes
   (including a new Markdown post) rebuild and deploy automatically.
4. Pull requests run the build and checks without deploying.

The workflow derives `site` and `base` from the repository:

- `budf93/budf93.github.io` → `https://budf93.github.io/`
- `budf93/portfolio` → `https://budf93.github.io/portfolio/`

All internal page and asset paths use `url()` in `src/lib/urls.ts`. Canonicals,
RSS links, robots, and sitemap use the configured origin and base. For local
testing of a project repository in PowerShell:

```powershell
$env:SITE_URL = 'https://budf93.github.io'
$env:BASE_PATH = '/portfolio/'
npm run build
npm run verify
npm run preview
# Open http://127.0.0.1:4321/portfolio/
Remove-Item Env:SITE_URL
Remove-Item Env:BASE_PATH
```

For a custom domain, set the GitHub repository Actions variable `SITE_URL`
(the origin, without a project path), set `BASE_PATH` to `/`, and add your
domain in GitHub Pages settings. Add `public/CNAME` if required by your
domain setup. No credentials belong in source or workflow variables.

Implementation follows Astro’s [content collections](https://docs.astro.build/en/guides/content-collections/),
[GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), and
[unified Markdown processor](https://docs.astro.build/en/reference/markdown-processors/unified/)
documentation. Astro 7 explicitly uses the unified processor to support
remark-math and rehype-katex for both Markdown and MDX.
