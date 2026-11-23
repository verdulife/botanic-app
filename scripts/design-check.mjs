#!/usr/bin/env node
/**
 * Valida DESIGN.md contra la especificación del formato (@google/design.md).
 *
 * Sale con 1 cuando el documento no es válido, con 2 cuando el linter no puede
 * ejecutarse, y con 0 solo cuando no hay errores ni avisos sin declarar:
 *
 *   - Errores del linter: referencias rotas, tokens o colores inválidos.
 *   - Avisos de una regla no declarada en AVISOS_ACEPTADOS (incluidos los que el
 *     linter devuelve sin regla, como un YAML que no parsea o claves duplicadas).
 *   - Secciones de nivel 2 que no pertenecen a la especificación, o que aparecen
 *     fuera del orden prescrito. El linter 0.4.0 no lo comprueba.
 *
 * Uso: pnpm design:check [archivo] [--full]
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const full = args.includes('--full');
const file = path.resolve(process.cwd(), args.find((a) => !a.startsWith('--')) ?? 'DESIGN.md');

const SECCIONES = [
	'Overview',
	'Colors',
	'Typography',
	'Layout',
	'Elevation & Depth',
	'Shapes',
	'Motion & Micro-interaction',
	'Voice & Content Strategy',
	'Components',
	"Do's and Don'ts",
];

const AVISOS_ACEPTADOS = {
	'orphaned-tokens':
		'La paleta es sistema, no un kit de componentes: las rampas y los tokens semánticos existen aunque ningún componente los declare.',
	'contrast-ratio':
		'primary-foreground sobre still-400 (2,6:1) es decisión de marca: válido para botón y texto grande, nunca para párrafo.',
	'token-like-ignored':
		'El bloque motion no está soportado por el linter 0.4.0, pero sí por la especificación; se exportará cuando lo soporte.',
};

const linter = process.env.DESIGN_CHECK_LINTER ?? fileURLToPath(import.meta.resolve('@google/design.md'));
const lint = spawnSync(process.execPath, [linter, 'lint', file, '--format', 'json'], { encoding: 'utf8' });

if (lint.error) {
	console.error(`No se pudo ejecutar el linter: ${lint.error.message}`);
	process.exit(2);
}

let report;
try {
	report = JSON.parse(lint.stdout);
} catch {
	console.error(lint.stderr?.trim() || lint.stdout || 'El linter no devolvió JSON.');
	process.exit(2);
}

const findings = report.findings ?? [];
const errores = findings.filter((f) => f.severity === 'error');
const avisos = findings.filter((f) => f.severity === 'warning');
const nuevos = avisos.filter((a) => !(a.rule in AVISOS_ACEPTADOS));

for (const [regla, lista] of Object.entries(Object.groupBy(avisos, (a) => a.rule ?? 'sin-regla'))) {
	const razon = AVISOS_ACEPTADOS[regla];
	console.log(`${razon ? '·' : '!'} ${regla}: ${lista.length} aviso(s)${razon ? ` — aceptado: ${razon}` : ' — sin declarar'}`);
	if (full || !razon) for (const a of lista.slice(0, full ? lista.length : 3)) console.log(`    ${a.path ?? '(documento)'}: ${a.message}`);
}

// Estructura: secciones de la especificación, presentes y en orden.
const secciones = [];
try {
	let enCerca = false;
	for (const linea of readFileSync(file, 'utf8').split('\n')) {
		if (/^\s*(```|~~~)/.test(linea)) enCerca = !enCerca;
		else if (!enCerca && linea.startsWith('## ')) secciones.push(linea.slice(3).trim());
	}
} catch {
	console.error(`No se pudo leer ${file}.`);
	process.exit(2);
}
const estructura = [];
let ultimo = -1;
for (const s of secciones) {
	const i = SECCIONES.indexOf(s);
	if (i === -1) estructura.push(`sección no reconocida por la especificación: "${s}"`);
	else if (i < ultimo) estructura.push(`sección fuera de orden: "${s}" debería ir antes de "${SECCIONES[ultimo]}"`);
	else ultimo = i;
}

// Un linter que falla sin declarar errores no permite dar el documento por válido.
if (lint.status !== 0 && !errores.length && !nuevos.length && !estructura.length) {
	console.error(`El linter salió con ${lint.status} sin declarar errores: no se puede dar el documento por válido.`);
	process.exit(2);
}

if (errores.length || nuevos.length || estructura.length) {
	if (errores.length) {
		console.error(`\n${errores.length} error(es):`);
		for (const e of errores) console.error(`  ${e.path ?? '(documento)'}: ${e.message}`);
	}
	if (nuevos.length) {
		console.error(`\n${nuevos.length} aviso(s) sin declarar: revisa si son un problema real y, si no, declara la razón en AVISOS_ACEPTADOS.`);
		for (const n of nuevos.slice(0, 10)) console.error(`  ${n.rule ?? 'sin-regla'} ${n.path ?? ''}: ${n.message}`);
	}
	if (estructura.length) {
		console.error('\nEstructura:');
		for (const e of estructura) console.error(`  ${e}`);
	}
	process.exit(1);
}

console.log(`\n${path.relative(process.cwd(), file)} válido: 0 errores, ${avisos.length} avisos declarados, ${secciones.length} secciones en orden.`);
