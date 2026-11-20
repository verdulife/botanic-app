import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Declaración explícita de las variables de entorno públicas.
 *
 * SvelteKit 3 dejó de inyectar `$env/static/public` por sí solo: ahora lee
 * este fichero (`src/env.ts`) y genera `$app/env/public` a partir de él. Sin
 * esta declaración, las variables existen en el proceso pero el módulo no
 * exporta nada y el build falla con MISSING_EXPORT.
 *
 * `static: true` conserva el comportamiento anterior: el valor se inlinea en
 * el bundle en tiempo de build.
 */
export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		static: true,
		description: 'URL del proyecto Supabase (https://<ref>.supabase.co)'
	},
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: {
		public: true,
		static: true,
		description: 'Clave publishable de Supabase, segura para el cliente y limitada por RLS'
	}
});
