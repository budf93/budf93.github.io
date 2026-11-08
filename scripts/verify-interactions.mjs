import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';

// Exercise the built client scripts against the generated DOM. This is not a
// substitute for browser layout QA, but verifies actual shipped interactions.
async function loadPage(path, { dark = false, storage = new Map(), blocked = false } = {}) {
  const { document, Event } = parseHTML(await readFile(resolve('dist', path), 'utf8'));
  const mediaHandlers = [];
  let prints = 0;
  const window = {
    matchMedia: () => ({
      matches: dark,
      addEventListener: (_, callback) => mediaHandlers.push(callback),
    }),
    print: () => {
      prints++;
    },
  };
  const localStorage = {
    getItem: (key) => {
      if (blocked) throw Error('Storage blocked');
      return storage.get(key) ?? null;
    },
    setItem: (key, value) => {
      if (blocked) throw Error('Storage blocked');
      storage.set(key, value);
    },
  };
  for (const script of document.querySelectorAll('script')) {
    if (script.getAttribute('type') === 'application/ld+json') continue;
    assert(
      !script.hasAttribute('src'),
      'Update harness to load bundled scripts if Astro externalizes them.',
    );
    runInNewContext(`(function(){${script.textContent}\n})();`, { document, window, localStorage });
  }
  return { document, Event, storage, mediaHandlers, prints: () => prints };
}

const page = await loadPage('writing/index.html');
const { document, Event } = page;
const search = document.getElementById('post-search');
const rows = [...document.querySelectorAll('[data-post]')];
const visibleCount = () => rows.filter((row) => !row.hidden).length;
if (rows.length > 0) {
  assert(
    !document.getElementById('writing-filters').hidden,
    'Filters were not progressively enabled',
  );
  assert.equal(visibleCount(), rows.length);
  search.value = rows[0].querySelector('h3').textContent.trim().toLowerCase();
  search.dispatchEvent(new Event('input'));
  assert(visibleCount() > 0, 'Title search did not find its article');
  assert.match(document.getElementById('filter-status').textContent, /articles? found/);
  search.value = 'no-matching-article';
  search.dispatchEvent(new Event('input'));
  assert.equal(visibleCount(), 0);
  assert(!document.getElementById('no-results').hidden, 'Empty state missing');
  search.value = '';
  const topicButton = document.querySelector('[data-tag]:not([data-tag=""])');
  if (topicButton) {
    topicButton.click();
    const expectedCount = rows.filter((row) =>
      JSON.parse(row.dataset.tags).includes(topicButton.dataset.tag),
    ).length;
    assert.equal(visibleCount(), expectedCount, 'Topic filter failed');
    assert.equal(topicButton.getAttribute('aria-pressed'), 'true');
  }
  document.querySelector('[data-tag=""]').click();
  assert.equal(visibleCount(), rows.length, 'All articles did not reset topic filter');
  assert(document.getElementById('no-results').hidden, 'Empty state did not clear');
} else {
  assert(document.querySelector('[data-writing-empty]'), 'Writing empty state missing');
  assert(!document.getElementById('writing-filters'), 'Empty writing page exposes filters');
  assert(!document.querySelector('.post-list'), 'Empty writing page exposes a post list');
}

const toggle = document.querySelector('.theme-toggle');
assert.equal(document.documentElement.dataset.theme, 'light');
toggle.click();
assert.equal(document.documentElement.dataset.theme, 'dark');
assert.equal(page.storage.get('theme'), 'dark');
assert.equal(toggle.getAttribute('aria-label'), 'Switch to light mode');
const reload = await loadPage('index.html', { storage: page.storage });
assert.equal(
  reload.document.documentElement.dataset.theme,
  'dark',
  'Theme did not persist across pages',
);
const preferred = await loadPage('index.html', { dark: true });
assert.equal(
  preferred.document.documentElement.dataset.theme,
  'dark',
  'System dark preference not respected',
);
preferred.mediaHandlers.forEach((handler) => handler({ matches: false }));
assert.equal(
  preferred.document.documentElement.dataset.theme,
  'light',
  'System preference change not followed',
);
const blocked = await loadPage('index.html', { blocked: true });
blocked.document.querySelector('.theme-toggle').click();
assert.equal(
  blocked.document.documentElement.dataset.theme,
  'dark',
  'Theme failed with blocked storage',
);
const cv = await loadPage('cv/index.html');
cv.document.getElementById('print-cv').click();
assert.equal(cv.prints(), 1, 'Print action did not execute');
console.log(
  `Verified ${rows.length ? 'article search, tags, and empty/reset states' : 'Writing empty state'}, theme preference/persistence, blocked-storage fallback, and CV print. Browser layout remains a separate check.`,
);
