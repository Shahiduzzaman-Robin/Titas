import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const SITE_URL = 'http://localhost:3000'; // Change to production URL later

export default async function sitemap() {
  const routes = [
    '',
    '/about',
    '/students',
    '/blog',
    '/contact',
    '/notices',
    '/constitution',
    '/committee',
    '/register',
    '/login',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const res = await axios.get(`${API_BASE_URL}/api/blog/posts`);
    const posts = res.data.posts || [];
    const postRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
    return [...routes, ...postRoutes];
  } catch (error) {
    console.error('Sitemap generation failed for posts:', error);
    return routes;
  }
}
