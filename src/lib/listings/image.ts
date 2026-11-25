/**
 * Fotos del anuncio: lo que hay que saber antes de subirlas.
 *
 * El bucket `listing-images` tiene un límite de 512 KB por fichero
 * (`supabase/migrations/20261124120000_baseline.sql`), y una foto de móvil pesa
 * varias veces eso. Por eso el navegador redimensiona y recodifica a webp en un
 * canvas hasta quedar por debajo del objetivo; lo que se sube es exactamente lo
 * que se previsualiza.
 *
 * Las medidas y los límites viven aquí para que la vista previa, la validación
 * del formulario y la escritura hablen del mismo número.
 */

/** Fotos por anuncio, igual que el formulario. */
export const MAX_PHOTOS = 5;

/** Límite del bucket: a partir de aquí Storage rechaza el fichero. */
export const MAX_PHOTO_BYTES = 512 * 1024;

/** Margen de seguridad: se comprime por debajo del límite del bucket. */
export const TARGET_PHOTO_BYTES = 500 * 1024;

/** Tipos que acepta el bucket, en el mismo orden de la migración. */
export const ACCEPTED_PHOTO_TYPES = ['image/webp', 'image/jpeg', 'image/png'] as const;

/** Una foto elegida: lo que se enseña y lo que se sube. */
export type PickedPhoto = {
	/**
	 * Data URL del fichero ya comprimido. Es a la vez la vista previa y lo que se
	 * guarda en el borrador, así que un borrador recuperado no depende de una
	 * URL de objeto que muere al recargar la página.
	 */
	preview: string;
	/** `null` en un borrador recuperado: el fichero se reconstruye al publicar. */
	file: File | null;
};

// Intentos de compresión, de mejor a peor: primero se baja la calidad y, si no
// basta, el tamaño. La lista es corta a propósito: cada vuelta cuesta una
// codificación de imagen en el hilo principal.
const MAX_SIDES = [1600, 1280, 1024, 800] as const;
const QUALITIES = [0.8, 0.68, 0.55, 0.45] as const;

/** Encaja una imagen en un cuadrado de `maxSide` sin ampliarla ni deformarla. */
export function fitWithin(
	width: number,
	height: number,
	maxSide: number
): { width: number; height: number } {
	const longest = Math.max(width, height);
	if (longest <= maxSide) return { width, height };
	const scale = maxSide / longest;
	return {
		width: Math.max(1, Math.round(width * scale)),
		height: Math.max(1, Math.round(height * scale))
	};
}

/** Extensión que corresponde al tipo MIME aceptado. */
export function extensionFor(mime: string): 'webp' | 'jpg' | 'png' {
	if (mime === 'image/jpeg') return 'jpg';
	if (mime === 'image/png') return 'png';
	return 'webp';
}

/** `true` si el tipo del fichero es uno de los que admite el bucket. */
export function isAcceptedPhoto(file: Pick<File, 'type'>): boolean {
	return (ACCEPTED_PHOTO_TYPES as readonly string[]).includes(file.type);
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

// WebP es el objetivo; un navegador que no lo codifica devuelve png desde
// `toBlob`, y ahí se cae a jpeg, que también acepta el bucket.
async function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
	const webp = await toBlob(canvas, 'image/webp', quality);
	if (webp && webp.type === 'image/webp') return webp;
	return toBlob(canvas, 'image/jpeg', quality);
}

function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(new Error('No pudimos leer la foto.'));
		reader.readAsDataURL(blob);
	});
}

function photoName(type: string): string {
	return `foto.${extensionFor(type)}`;
}

/**
 * Comprime una foto para que quepa en el bucket: redimensiona, recodifica y
 * comprueba el resultado. Lanza si no consigue bajar del objetivo; no devuelve
 * nunca un fichero que Storage vaya a rechazar.
 */
export async function compressPhoto(file: File): Promise<PickedPhoto> {
	if (!isAcceptedPhoto(file)) {
		throw new Error('La foto tiene que ser webp, jpeg o png.');
	}

	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file);
	} catch {
		throw new Error('No pudimos leer la foto. Prueba con otra imagen.');
	}

	try {
		for (const maxSide of MAX_SIDES) {
			const { width, height } = fitWithin(bitmap.width, bitmap.height, maxSide);
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const context = canvas.getContext('2d');
			if (!context) throw new Error('El navegador no puede preparar la foto.');
			context.drawImage(bitmap, 0, 0, width, height);

			for (const quality of QUALITIES) {
				const blob = await encode(canvas, quality);
				if (!blob || blob.size > TARGET_PHOTO_BYTES) continue;

				const compressed = new File([blob], photoName(blob.type), {
					type: blob.type,
					lastModified: Date.now()
				});
				return { file: compressed, preview: await blobToDataUrl(compressed) };
			}
		}
	} finally {
		bitmap.close();
	}

	throw new Error('La foto sigue pesando demasiado. Prueba con una imagen más pequeña.');
}

/**
 * Reconstruye el fichero de una foto recuperada de un borrador, donde solo se
 * guardó la vista previa.
 */
export async function fileFromPreview(preview: string, name = 'foto.webp'): Promise<File> {
	const blob = await (await fetch(preview)).blob();
	return new File([blob], name, { type: blob.type || 'image/webp' });
}
