import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Puerto fijo, sin deriva: los enlaces de los correos de auth vuelven a una URL
	// exacta, y esa URL tiene que coincidir con la lista de redirecciones de
	// Supabase. Si el puerto cambia solo, el enlace se va al Site URL del proyecto.
	//
	// `strictPort` hace que el servidor falle si el 5173 está ocupado, en vez de
	// arrancar en otro puerto y romper los enlaces en silencio. Si te pasa: libera
	// el puerto o cámbialo aquí **y** añade la URL nueva a Supabase.
	server: { port: 5173, strictPort: true },
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
