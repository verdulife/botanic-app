import type { RequestEvent } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';
import type { Database } from './types';

export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					// Supabase refresca el token por su cuenta y puede intentar escribir
					// cookies cuando la respuesta ya está generada. Sin este try/catch el
					// proceso cae con `cookies_set_after_response`.
					try {
						for (const { name, value, options } of cookiesToSet) {
							event.cookies.set(name, value, { ...options, path: '/' });
						}
					} catch (err) {
						console.warn('[supabase] no se pudo escribir la cookie de sesión:', err);
					}
				}
			}
		}
	);
}