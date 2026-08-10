import { error } from "@sveltejs/kit";
import { marked, Renderer } from "marked";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "$lib/blog/posts";

export const prerender = true;

const renderer = new Renderer();
renderer.image = ({ href, title, text }) => {
	const webp = (href ?? "").replace(/\.(jpe?g|png)$/i, ".webp");
	const isLocal = (href ?? "").startsWith("/images/");
	const img = `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ""} loading="lazy">`;
	return isLocal ? `<picture><source type="image/webp" srcset="${webp}">${img}</picture>` : img;
};

function mergeFigureCaptions(html: string): string {
	return html.replace(
		/<p>(<picture>[\s\S]*?<\/picture>)<\/p>\s*<p><em>(Foto:[^<]*)<\/em><\/p>/g,
		'<figure class="blog-figure not-prose">$1<figcaption>$2</figcaption></figure>'
	);
}

export const load = async ({ params }) => {
	const post = getPostBySlug(params.slug);
	if (!post) throw error(404, "Artículo no encontrado");
	const html = mergeFigureCaptions(await marked.parse(post.content, { gfm: true, renderer }));
	const related = getRelatedPosts(post);
	return { post, html, related };
};

export const entries = () => getAllPosts().map((post) => ({ slug: post.slug }));
