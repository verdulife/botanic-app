import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			alias: {
				// SvelteKit 3 retiró $lib en favor de subpath imports (#lib). Esta es
				// la vía que documenta el propio Kit para seguir usándolo mientras
				// se migra: 305 importaciones de golpe es demasiado para un commit.
				$lib: 'src/lib'
			},
			prerender: {
				handleUnseenRoutes: 'ignore'
			},
			compilerOptions: {
				preserveComments: true
			}
		})
	]
});
