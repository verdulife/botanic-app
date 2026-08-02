import matter from "gray-matter";

export type Category = "guias" | "noticias" | "comunidad";

export interface PostMeta {
	title: string;
	description: string;
	date: string;
	updated?: string;
	category: Category;
	tags: string[];
	author: string;
	image?: string;
}

export interface Post {
	slug: string;
	meta: PostMeta;
	content: string;
	readingTime: number;
}

interface RawFile {
	slug: string;
	raw: string;
}

const modules = import.meta.glob<string>(
	"/src/lib/blog/posts/**/*.md",
	{ eager: true, query: "?raw", import: "default" }
);

const WPM = 200;

function getSlug(filePath: string): string {
	return filePath.replace(/^\/(?:src\/lib\/blog\/posts\/)?/, "").replace(/\.md$/, "");
}

function readingTime(content: string): number {
	const words = content.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WPM));
}

function formatDate(val: unknown): string {
	if (val instanceof Date) return val.toISOString().slice(0, 10);
	return String(val ?? "");
}

function toPost(file: RawFile): Post {
	const { data, content } = matter(file.raw);
	const meta: PostMeta = {
		title: String(data.title ?? ""),
		description: String(data.description ?? ""),
		date: formatDate(data.date),
		updated: data.updated ? formatDate(data.updated) : undefined,
		category: (data.category as Category) ?? "guias",
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		author: String(data.author ?? "Botanic"),
		image: data.image ? String(data.image) : undefined,
	};
	return {
		slug: file.slug,
		meta,
		content,
		readingTime: readingTime(content),
	};
}

const posts: Post[] = Object.entries(modules)
	.map(([path, raw]) => toPost({ slug: getSlug(path), raw }))
	.sort((a, b) => Date.parse(b.meta.date) - Date.parse(a.meta.date));

const SPAIN_UTC_OFFSET_MS = 2 * 60 * 60 * 1000;

function isPublished(post: Post, now = new Date()): boolean {
	return Date.parse(post.meta.date) - SPAIN_UTC_OFFSET_MS <= now.getTime();
}

export function getAllPosts(): Post[] {
	return posts
		.filter((post) => isPublished(post));
}

export function getPostBySlug(slug: string): Post | undefined {
	const post = posts.find((p) => p.slug === slug);
	if (!post || !isPublished(post)) return undefined;
	return post;
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
	return getAllPosts()
		.filter((p) => p.slug !== post.slug && p.meta.category === post.meta.category)
		.slice(0, limit);
}
