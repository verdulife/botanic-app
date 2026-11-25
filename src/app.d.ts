import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ user: User | null }>;
		}
	}
}

export {};