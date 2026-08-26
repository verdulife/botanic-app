import type { AuthError } from '@supabase/supabase-js';

const MESSAGES: Record<string, string> = {
	invalid_credentials: 'Email o contraseña incorrectos.',
	email_not_confirmed:
		'Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.',
	user_already_exists: 'Ya existe una cuenta con este email. Inicia sesión.',
	user_already_registered: 'Ya existe una cuenta con este email. Inicia sesión.',
	weak_password: 'La contraseña es demasiado débil. Usa al menos 8 caracteres.',
	email_address_invalid: 'Email inválido.',
	email_exists: 'Ya existe una cuenta con este email.',
	over_email_send_rate_limit:
		'Demasiados intentos. Espera unos minutos antes de volver a probar.',
	email_rate_limit_exceeded: 'Demasiados intentos. Espera unos minutos.',
	otp_expired: 'El enlace ha expirado. Solicita uno nuevo.',
	otp_disabled: 'El enlace ya no es válido.',
	same_password: 'La nueva contraseña debe ser distinta a la actual.',
	captcha_failed: 'Verificación de captcha fallida. Inténtalo de nuevo.',
	validation_failed: 'Los datos no son válidos. Revisa el formulario.'
};

export function mapAuthError(error: AuthError | null | undefined): string {
	if (!error) return 'Ha ocurrido un error inesperado.';
	return MESSAGES[error.code ?? ''] ?? error.message ?? 'Ha ocurrido un error inesperado.';
}