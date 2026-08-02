import { getAllPosts } from "$lib/blog/posts";
import { escapeXml } from "$lib/blog/utils";

export const prerender = true;

const BASE = "https://www.botanicapp.es";

export const GET = () => {
	const today = new Date().toISOString().slice(0, 10);
	const urls = [
		{ loc: `${BASE}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
		{ loc: `${BASE}/app`, lastmod: today, changefreq: "weekly", priority: "0.8" },
		{ loc: `${BASE}/blog`, lastmod: today, changefreq: "daily", priority: "0.9" },
		...getAllPosts().map((post) => ({
			loc: `${BASE}/blog/${post.slug}`,
			lastmod: post.meta.updated ?? post.meta.date,
			changefreq: "monthly",
			priority: "0.7",
		})),
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `\t<url>
\t\t<loc>${escapeXml(url.loc)}</loc>
\t\t<lastmod>${escapeXml(url.lastmod)}</lastmod>
\t\t<changefreq>${url.changefreq}</changefreq>
\t\t<priority>${url.priority}</priority>
\t</url>`
	)
	.join("\n")}
</urlset>
`;

	return new Response(body, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
