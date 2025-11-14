import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

type TLanguage = 'ru' | 'en';

interface IBlogPost {
    title: string;
    slug: string;
    priority: number;
    publishedAt: Date;
    updatedAt: Date;
    language: TLanguage;
    excerpt?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://blog.didgibot.com';
const OUTPUT_PATH = path.join(__dirname, '../dist/dgb-blog/browser/sitemap.xml');

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

async function fetchBlogPosts(): Promise<IBlogPost[]> {
    // const res = await fetch('https://api.didgibot.com/api/sitemap');
    const res = await fetch('http://host.docker.internal:8888/api/sitemap');

    if (!res.ok) {
        throw new Error(`Failed to fetch sitemap data: ${res.statusText}`);
    }

    const { data } = await res.json();

    return data;
}

async function generateSitemap(): Promise<string> {
    const posts = await fetchBlogPosts();
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/en/blog', priority: '0.9', changefreq: 'weekly' },
        { url: '/ru/blog', priority: '0.9', changefreq: 'weekly' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    staticPages.forEach((page) => {
        sitemap += `
        <url>
            <loc>${escapeXml(BASE_URL + page.url)}</loc>
            <lastmod>${formatDate(new Date())}</lastmod>
            <changefreq>${page.changefreq}</changefreq>
            <priority>${page.priority || '0.8'}</priority>
        </url>
    `;
    });

    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    sortedPosts.forEach((post) => {
        const updatedAt = formatDate(new Date(post.updatedAt));
        sitemap += `
        <url>
            <loc>${escapeXml(BASE_URL + '/en/blog/article/' + post.slug)}</loc>
            <lastmod>${updatedAt}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>${post.priority}</priority>`;

        sitemap += `
        </url>`;
        sitemap += `
        <url>
            <loc>${escapeXml(BASE_URL + '/ru/blog/article/' + post.slug)}</loc>
            <lastmod>${updatedAt}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>${post.priority}</priority>`;

        sitemap += `
        </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
}

async function main() {
    try {
        console.log('Generating sitemap...');
        const sitemap = await generateSitemap();

        // Create directory if it does not exist
        const dir = path.dirname(OUTPUT_PATH);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write sitemap to file
        fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');

        // Also generate for source directory (for development)
        const srcPath = path.join(__dirname, '../src/sitemap.xml');
        fs.writeFileSync(srcPath, sitemap, 'utf-8');
        console.log(`Sitemap also saved to ${srcPath}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

main();
