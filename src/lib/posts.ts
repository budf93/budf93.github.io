import { getCollection } from 'astro:content';

export async function getPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id),
  );
}
