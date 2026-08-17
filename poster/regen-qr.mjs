#!/usr/bin/env bun
import qrcode from 'qrcode';

const url = 'https://www.botanicapp.es';
const outPath = 'poster/qr.svg';

const svg = await qrcode.toString(url, {
	type: 'svg',
	margin: 2,
	color: {
		dark: '#1D3723',
		light: '#FFEB82'
	},
	errorCorrectionLevel: 'M'
});

await Bun.write(outPath, svg);
console.log(`saved qr to: ${outPath}`);