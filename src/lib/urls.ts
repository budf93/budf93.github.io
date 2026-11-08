export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function absolute(path = ''): string {
  return new URL(url(path), import.meta.env.SITE).href;
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export function readingTime(body = ''): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
}
