import { getAllPosts } from "$lib/blog/posts";
import { escapeXml } from "$lib/blog/utils";

export const prerender = true;

const BASE = "https://www.botanicapp.es";

export const GET = () => {
	const items = getAllPosts()
		.map(
			(post) => `\t\t<item>
\t\t\t<title>${escapeXml(post.meta.title)}</title>
\t\t\t<link>${BASE}/blog/${post.slug}</link>
\t\t\t<guid isPermaLink="true">${BASE}/blog/${post.slug}</guid>
\t\t\t<pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
\t\t\t<description>${escapeXml(post.meta.description)}</description>
\t\t</item>`
		)
		.join("\n");

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
\t<title>Blog Botanic</title>
\t<link>${BASE}/blog</link>
\t<description>Guías de cuidados, propagación y novedades para plant lovers.</description>
\t<language>es-es</language>
\t<atom:link href="${BASE}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>
`;

	return new Response(body, {
		headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
	});
};
