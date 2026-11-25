import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Declaración explícita de las variables de entorno.
 *
 * SvelteKit 3 dejó de inyectar `$env/*` por sí solo: ahora lee este fichero y
 * genera `$app/env/public` y `$app/env/private` a partir de él, exportando cada
 * variable **con su nombre**. Una variable que no esté declarada aquí no existe
 * para la aplicación, aunque esté en el fichero de entorno: no falla, llega
 * `undefined`.
 *
 * `static: true` inlinea el valor en el bundle en tiempo de build. Los secretos
 * van con `static: false`, para leerlos al arrancar y no dejarlos escritos.
 *
 * Una variable sin `schema` es obligatoria: si falta, el build falla. Las que
 * pueden no estar —las que encienden o apagan una función— llevan `schema` y
 * devuelven `undefined` cuando faltan.
 */
const opcional = (value: string | undefined) => value?.trim() || undefined;

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
	},

	PUBLIC_TURNSTILE_SITE_KEY: {
		public: true,
		static: true,
		schema: opcional,
		description: 'Site key de Cloudflare Turnstile. Sin ella el widget no se pinta y no bloquea'
	},
	TURNSTILE_SECRET: {
		schema: opcional,
		description: 'Secret de Turnstile. Sin él no se verifica el testigo'
	},
	TURNSTILE_SECRET_KEY: {
		schema: opcional,
		description: 'Nombre alternativo del secret de Turnstile'
	},
	TURNSTILE_HOSTNAMES: {
		schema: opcional,
		description: 'Dominios autorizados en siteverify, separados por comas. En local se omite'
	},
	RATE_LIMIT_SALT: {
		schema: opcional,
		description: 'Sal para hashear la IP del límite de intentos'
	},

	RESEND_API_KEY: {
		schema: opcional,
		description: 'Clave de envío de Resend. Sin ella el alta no manda correos'
	},
	RESEND_AUDIENCE_ID: {
		schema: opcional,
		description: 'Audience de Resend donde se dan de alta los apuntados'
	},
	ADMIN_NOTIFY_EMAIL: {
		schema: opcional,
		description: 'Destinatarios del aviso de alta, separados por comas'
	},

	GEMINI_API_KEY: {
		schema: opcional,
		description: 'Clave de Gemini para las funciones de IA'
	},
	GROQ_API_KEY: {
		schema: opcional,
		description: 'Clave de Groq para las funciones de IA'
	},
	PLANTNET_API_KEY: {
		schema: opcional,
		description: 'Clave de Pl@ntNet para identificar especies'
	}
});
