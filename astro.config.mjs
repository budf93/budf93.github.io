import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// The Pages workflow supplies these for both account and project repositories.
const site = process.env.SITE_URL || 'https://budf93.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [mdx(), sitemap({ filter: (url) => !url.endsWith('/404/') })],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { className: ['heading-anchor'], ariaLabel: 'Link to this section' },
            content: { type: 'text', value: '#' },
          },
        ],
      ],
      shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    }),
  },
});
