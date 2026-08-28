import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Database } from '$lib/supabase/types';
import { isMockAuth } from '$lib/auth-mode';
import { getMockProfile, updateProfile, usernameExists } from '$lib/mock/auth-server';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession();
	if (!user) throw redirect(303, '/app/login?next=/app/bienvenida');

	let profile: Database['public']['Tables']['profiles']['Row'] | null;
	if (isMockAuth()) {
		profile = getMockProfile(user.id);
	} else {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.maybeSingle();

		if (error) {
			console.error('[bienvenida] load profile:', error);
			throw error;
		}
		profile = data;
	}

	return { profile };
};

export const actions: Actions = {
	default: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { user } = await safeGetSession();
		if (!user) throw redirect(303, '/app/login');

		const formData = await request.formData();
		const intent = String(formData.get('intent') ?? 'save');

		if (intent === 'skip') {
			throw redirect(303, '/app');
		}

		const username = String(formData.get('username') ?? '').trim().toLowerCase();
		const fullName = String(formData.get('full_name') ?? '').trim();
		const locationLabel = String(formData.get('location_label') ?? '').trim();
		const bio = String(formData.get('bio') ?? '').trim();

		const values: Database['public']['Tables']['profiles']['Update'] = {};

		if (username) {
			if (!USERNAME_RE.test(username)) {
				return fail(400, {
					error: 'El nombre de usuario debe tener 3-20 caracteres (letras, números y guiones bajos).',
					values: { username, full_name: fullName, location_label: locationLabel, bio }
				});
			}
			values.username = username;
		}

		if (fullName) values.full_name = fullName;
		if (locationLabel) values.location_label = locationLabel;
		if (bio) values.bio = bio;

		if (Object.keys(values).length === 0) {
			throw redirect(303, '/app');
		}

		const echoValues = { username, full_name: fullName, location_label: locationLabel, bio };

		if (isMockAuth()) {
			if (username && usernameExists(username, user.id)) {
				return fail(400, {
					error: 'Ese nombre de usuario ya está en uso.',
					values: echoValues
				});
			}
			updateProfile(user.id, values);
			throw redirect(303, '/app');
		}

		const { error } = await supabase
			.from('profiles')
			.update(values)
			.eq('id', user.id);

		if (error) {
			if (error.code === '23505') {
				return fail(400, {
					error: 'Ese nombre de usuario ya está en uso.',
					values: echoValues
				});
			}
			console.error('[bienvenida] update profile:', error);
			return fail(500, {
				error: 'No pudimos guardar los cambios. Inténtalo de nuevo.',
				values: echoValues
			});
		}

		throw redirect(303, '/app');
	}
};