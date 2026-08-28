// Único punto de conmutación entre autenticación mock y Supabase.
//
// - 'mock'    : sesión local simulada (cookie `botanic_mock_session`), sin
//               depender de Supabase. Usado durante la fase de wireframe/UI.
// - 'supabase': autenticación real con Supabase Auth (SSR).
//
// Al conectar Supabase: cambiar a 'supabase' y borrar el módulo mock cuando
// ya no se necesite. Ver docs/app/auth.md.
export const AUTH_MODE: 'mock' | 'supabase' = 'mock';

export function isMockAuth(): boolean {
	return AUTH_MODE === 'mock';
}