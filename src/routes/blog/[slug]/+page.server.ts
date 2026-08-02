import { error } from "@sveltejs/kit";
import { marked } from "marked";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "$lib/blog/posts";

export const prerender = true;

export const load = async ({ params }) => {
	const post = getPostBySlug(params.slug);
	if (!post) throw error(404, "Artículo no encontrado");
	const html = await marked.parse(post.content, { gfm: true });
	const related = getRelatedPosts(post);
	return { post, html, related };
};

export const entries = () => getAllPosts().map((post) => ({ slug: post.slug }));
