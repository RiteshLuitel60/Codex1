import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://worldleadersatlas.example';
  return [
    '',
    '/countries',
    '/tracker',
    '/methodology',
    '/admin/conflicts'
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.7
  }));
}
