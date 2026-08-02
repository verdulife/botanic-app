import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: "ignore"
		}
	},
	vitePlugin: {
		compilerOptions: {
			preserveComments: true
		}
	}
};

export default config;
