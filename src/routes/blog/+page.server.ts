import { getAllPosts } from "$lib/blog/posts";

export const prerender = true;

const PER_PAGE = 9;

export const load = () => {
	const all = getAllPosts();
	const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
	return {
		posts: all.slice(0, PER_PAGE),
		page: 1,
		totalPages,
		total: all.length,
	};
};
