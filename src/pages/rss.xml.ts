import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import { site } from '../data/site';
import { absolute } from '../lib/urls';

export async function GET() {
  return rss({
    title: `${site.name} — Writing`,
    description: site.description,
    site: absolute(),
    items: (await getPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: absolute(`writing/${post.id}/`),
      categories: post.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
