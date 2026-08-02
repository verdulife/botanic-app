import { error } from "@sveltejs/kit";
import { getAllPosts } from "$lib/blog/posts";

export const prerender = true;

const PER_PAGE = 9;

export const load = ({ params }) => {
	const page = Number(params.page);
	if (!Number.isInteger(page) || page < 2) throw error(404);
	const all = getAllPosts();
	const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
	if (page > totalPages) throw error(404);
	const start = (page - 1) * PER_PAGE;
	return {
		posts: all.slice(start, start + PER_PAGE),
		page,
		totalPages,
		total: all.length,
	};
};

export const entries = () => {
	const totalPages = Math.max(1, Math.ceil(getAllPosts().length / PER_PAGE));
	return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
		page: String(i + 2),
	}));
};
