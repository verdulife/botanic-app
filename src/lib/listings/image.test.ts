import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	MAX_PHOTO_BYTES,
	TARGET_PHOTO_BYTES,
	extensionFor,
	fitWithin,
	isAcceptedPhoto
} from './image.ts';

test('la foto se redimensiona manteniendo la proporción', () => {
	assert.deepEqual(fitWithin(4000, 3000, 1600), { width: 1600, height: 1200 });
	assert.deepEqual(fitWithin(3000, 4000, 1600), { width: 1200, height: 1600 });
});

test('una foto que ya cabe no se amplía', () => {
	assert.deepEqual(fitWithin(800, 600, 1600), { width: 800, height: 600 });
});

test('la extensión sale del tipo MIME que acepta el bucket', () => {
	assert.equal(extensionFor('image/webp'), 'webp');
	assert.equal(extensionFor('image/jpeg'), 'jpg');
	assert.equal(extensionFor('image/png'), 'png');
});

test('el límite del objetivo queda por debajo del límite del bucket', () => {
	// El bucket rechaza a partir de 512 KB: lo comprimido tiene que caber.
	assert.equal(MAX_PHOTO_BYTES, 512 * 1024);
	assert.ok(TARGET_PHOTO_BYTES < MAX_PHOTO_BYTES);
});

test('solo se aceptan las imágenes que admite el bucket', () => {
	assert.equal(isAcceptedPhoto({ type: 'image/webp' } as File), true);
	assert.equal(isAcceptedPhoto({ type: 'image/jpeg' } as File), true);
	assert.equal(isAcceptedPhoto({ type: 'image/png' } as File), true);
	assert.equal(isAcceptedPhoto({ type: 'image/heic' } as File), false);
	assert.equal(isAcceptedPhoto({ type: 'application/pdf' } as File), false);
	// Un fichero sin tipo declarado no es una foto reconocible.
	assert.equal(isAcceptedPhoto({ type: '' } as File), false);
});
