// Cliente de identificación de especie (Pl@ntNet vía /api/identify-plant).
// Convierte la imagen local (webp) a jpeg con Canvas antes de enviarla, porque
// Pl@ntNet rechaza webp. La clave nunca sale del servidor.

export type IdentifyResult = {
	name: string;
	scientific: string;
	genus?: string;
	family?: string;
	confidence: number;
};

export type IdentifyResponse = {
	results: IdentifyResult[];
	remaining: number | null;
};

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
		img.src = src;
	});
}

// Convierte cualquier imagen del mismo origen (p.ej. /images/seed/*.webp) a un
// data-uri jpeg. Escala si el lado mayor supera 1600px para no enviar gigas.
async function toJpegDataUri(src: string): Promise<string> {
	const img = await loadImage(src);
	const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
	canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas no disponible');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL('image/jpeg', 0.85);
}

export async function identifyPlant(src: string): Promise<IdentifyResponse> {
	const dataUri = await toJpegDataUri(src);
	const res = await fetch('/api/identify-plant', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ image: dataUri })
	});
	if (!res.ok) {
		let msg = 'La identificación falló';
		try {
			const data = (await res.json()) as { error?: string };
			if (data.error) msg = data.error;
		} catch {
			// cuerpo no JSON
		}
		throw new Error(msg);
	}
	return (await res.json()) as IdentifyResponse;
}