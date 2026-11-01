import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vaibhav-singhal.netlify.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/interview-experience'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
