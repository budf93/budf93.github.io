import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, join, extname } from 'node:path';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';

const root = resolve('dist');
const site = new URL(process.env.SITE_URL || 'https://budf93.github.io');
const base = `/${(process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, '');
const errors = [];
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);
const documents = new Map();
for (const file of files.filter((file) => file.endsWith('.html'))) {
  documents.set(file, parseHTML(await readFile(file, 'utf8')).document);
}
function fail(file, message) {
  errors.push(`${relative(root, file)}: ${message}`);
}
async function checkReference(file, ref, pageUrl) {
  if (!ref || /^(mailto:|tel:|data:|javascript:)/i.test(ref)) return;
  let target;
  try {
    target = new URL(ref, pageUrl);
  } catch {
    fail(file, `Invalid URL ${ref}`);
    return;
  }
  if (target.origin !== site.origin) return;
  if (base && target.pathname !== base && !target.pathname.startsWith(`${base}/`)) {
    fail(file, `URL escapes configured base: ${ref}`);
    return;
  }
  let path = decodeURIComponent(target.pathname.slice(base.length));
  let destination = resolve(root, `.${path || '/'}`);
  if (
    !destination.startsWith(`${root}/`) &&
    !destination.startsWith(`${root}\\`) &&
    destination !== root
  ) {
    fail(file, `URL escapes output directory: ${ref}`);
    return;
  }
  try {
    const info = await stat(destination);
    if (info.isDirectory()) destination = join(destination, 'index.html');
    await stat(destination);
  } catch {
    fail(file, `Missing local target: ${ref}`);
    return;
  }
  if (target.hash && documents.has(destination)) {
    const id = decodeURIComponent(target.hash.slice(1));
    if (!documents.get(destination).getElementById(id)) fail(file, `Missing anchor: ${ref}`);
  }
}
for (const [file, document] of documents) {
  const path = relative(root, file)
    .replaceAll('\\', '/')
    .replace(/index\.html$/, '');
  const pageUrl = new URL(`${base}/${path}`, site);
  assert.equal(document.querySelectorAll('h1').length, 1, `${path}: expected one h1`);
  for (const selector of [
    'title',
    'meta[name="description"]',
    'link[rel="canonical"]',
    'meta[property="og:image"]',
    'link[rel="alternate"][type="application/rss+xml"]',
  ]) {
    if (!document.querySelector(selector)) fail(file, `Missing metadata: ${selector}`);
  }
  if (!document.querySelector('a.skip-link') || !document.getElementById('main'))
    fail(file, 'Missing skip navigation');
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (canonical && !canonical.startsWith(`${site.origin}${base}/`))
    fail(file, `Incorrect canonical ${canonical}`);
  for (const element of document.querySelectorAll('[href], [src]')) {
    await checkReference(
      file,
      element.getAttribute('href') || element.getAttribute('src'),
      pageUrl,
    );
  }
  for (const image of document.querySelectorAll('img'))
    if (!image.hasAttribute('alt')) fail(file, 'Image without alt text');
  const html = document.toString();
  if (
    /\.docx|docs\.google\.com|drive\.google\.com|lingkarsolution|budf03@gmail|\+6289601632212/.test(
      html,
    )
  )
    fail(file, 'Private/editable source reference in public output');
  if (/katex-error|Your next technical note/.test(html))
    fail(file, 'Math error or template leaked');
}
const reasoning = documents.get(
  join(root, 'writing', 'abduction-and-the-search-space', 'index.html'),
);
const systems = documents.get(
  join(root, 'writing', 'when-inference-isnt-the-bottleneck', 'index.html'),
);
if (reasoning) {
  assert(reasoning.querySelector('.katex-display'), 'MDX display math did not render');
  assert(reasoning.querySelector('.katex:not(.katex-display)'), 'Inline math did not render');
  assert(reasoning.querySelector('.pipeline'), 'MDX Astro component did not render');
  assert(reasoning.querySelector('.article-toc'), 'Automatic table of contents missing');
}
if (systems) {
  assert(systems.querySelector('pre.astro-code'), 'Syntax-highlighted code missing');
  assert(systems.querySelector('table'), 'GFM table missing');
  assert(systems.querySelector('img[alt]'), 'Markdown image missing');
  assert(systems.querySelector('[data-footnotes]'), 'Footnotes missing');
}
async function collectDraftIds(directory, prefix = '') {
  const ids = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory())
      ids.push(...(await collectDraftIds(join(directory, entry.name), `${prefix}${entry.name}/`)));
    else if (/\.mdx?$/.test(entry.name)) {
      const source = await readFile(join(directory, entry.name), 'utf8');
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
      if (/^draft:\s*true\s*$/m.test(frontmatter))
        ids.push(`${prefix}${entry.name.replace(/\.mdx?$/, '')}`);
    }
  }
  return ids;
}
const draftIds = await collectDraftIds('src/content/blog');
for (const id of draftIds) {
  assert(!documents.has(join(root, 'writing', id, 'index.html')), `Draft route generated: ${id}`);
  for (const [file, document] of documents) {
    for (const link of document.querySelectorAll('a[href]')) {
      if (link.getAttribute('href').includes(`/writing/${id}/`))
        fail(file, `Link to unpublished draft: ${id}`);
    }
  }
}
for (const name of [
  'rss.xml',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'robots.txt',
  '404.html',
  'social-card.png',
]) {
  assert(files.includes(join(root, name)), `Missing ${name}`);
}
for (const name of ['rss.xml', 'sitemap-0.xml']) {
  const content = await readFile(join(root, name), 'utf8');
  assert(
    !content.includes('_post-template') && !content.includes('draft-example'),
    `${name}: draft content leaked`,
  );
  for (const id of draftIds)
    assert(!content.includes(`/writing/${id}/`), `${name}: draft leaked: ${id}`);
  const links = [...content.matchAll(/<(?:loc|link)>(.*?)<\/(?:loc|link)>/g)].map(
    (match) => match[1],
  );
  for (const link of links) await checkReference(join(root, name), link, site);
}
assert(!files.some((file) => file.includes('draft-example')), 'Draft route was generated');
for (const file of files.filter((file) => extname(file) === '.css')) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(/url\((?:["']?)([^"')]+)["']?\)/g)) {
    await checkReference(
      file,
      match[1],
      new URL(`${base}/${relative(root, file).replaceAll('\\', '/')}`, site),
    );
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Verified ${documents.size} HTML pages: local links/assets, anchors, metadata, RSS, sitemap, draft exclusion, and source privacy (base: ${base || '/'}).`,
  );
