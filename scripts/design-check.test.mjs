import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const run = (file, env = {}) =>
	spawnSync(process.execPath, ['scripts/design-check.mjs', file], { cwd: root, encoding: 'utf8', env: { ...process.env, ...env } });
const creados = [];
after(() => {
	for (const dir of creados) rmSync(dir, { recursive: true, force: true });
});
const fixture = (content) => {
	mkdirSync(tmpdir(), { recursive: true });
	const dir = mkdtempSync(path.join(tmpdir(), 'design-check-'));
	creados.push(dir);
	const file = path.join(dir, 'DESIGN.md');
	writeFileSync(file, content);
	return file;
};

test('S1: el DESIGN.md del repositorio pasa el gate sin errores', () => {
	const r = run('DESIGN.md');
	assert.equal(r.status, 0, r.stderr);
	assert.match(r.stdout, /0 errores/);
});

test('S2: una referencia de token rota falla y nombra el componente', () => {
	const file = fixture(readFileSync(path.join(root, 'DESIGN.md'), 'utf8').replaceAll('{colors.light.card}', '{colors.no-existe}'));
	const r = run(file);
	assert.equal(r.status, 1, r.stdout);
	assert.match(r.stderr, /Reference \{colors\.no-existe\} does not resolve/);
});

test('S3: si el linter no puede ejecutarse, sale con 2 y no con 0', () => {
	const r = run(path.join(tmpdir(), 'no-existe-DESIGN.md'));
	assert.equal(r.status, 2, r.stdout);
});

test('S4: una clave YAML duplicada falla el gate, y por esa razón', () => {
	const limpio = readFileSync(path.join(root, 'DESIGN.md'), 'utf8');
	const file = fixture(limpio.replace('  primary: "oklch(0.687 0.089 148)"', '  primary: "oklch(0.687 0.089 148)"\n  primary: "oklch(0.687 0.089 148)"'));
	const r = run(file);
	assert.equal(r.status, 1, `esperaba fallo, salió ${r.status}: ${r.stdout}`);
	assert.match(r.stderr, /Map keys must be unique/);
});

test('S5: un aviso de una regla no declarada falla el gate', () => {
	const file = fixture('---\nversion: alpha\nname: T\ncolors:\n  primary: "#123456"\n---\n\n# T\n\n## Overview\n\nTexto.\n');
	const r = run(file);
	assert.equal(r.status, 1, r.stdout);
	assert.match(r.stderr, /missing-typography/);
});

test('S6: un titular dentro de un bloque de código no cuenta como sección', () => {
	const limpio = readFileSync(path.join(root, 'DESIGN.md'), 'utf8');
	const file = fixture(`${limpio}\n\`\`\`md\n## Reglas\n\`\`\`\n`);
	const r = run(file);
	assert.equal(r.status, 0, r.stderr);
});

test('S7: las secciones de la especificación deben ir en orden', () => {
	const file = fixture('---\nversion: alpha\nname: T\ncolors:\n  primary: "#123456"\n---\n\n# T\n\n## Colors\n\nTexto.\n\n## Overview\n\nTexto.\n');
	const r = run(file);
	assert.equal(r.status, 1, r.stdout);
	assert.match(r.stderr, /fuera de orden/);
});

test('S8: una sección que la especificación no reconoce falla el gate', () => {
	const file = fixture('---\nversion: alpha\nname: T\ncolors:\n  primary: "#123456"\n---\n\n# T\n\n## Overview\n\nTexto.\n\n## Reglas\n\nTexto.\n');
	const r = run(file);
	assert.equal(r.status, 1, r.stdout);
	assert.match(r.stderr, /no reconocida/);
});

test('S9: un linter que falla sin declarar errores no se da por válido', () => {
	mkdirSync(tmpdir(), { recursive: true });
	const dir = mkdtempSync(path.join(tmpdir(), 'design-check-'));
	creados.push(dir);
	const falso = path.join(dir, 'linter-falso.mjs');
	writeFileSync(falso, 'console.log(JSON.stringify({ findings: [] })); process.exit(3);\n');
	const r = run(path.join(root, 'DESIGN.md'), { DESIGN_CHECK_LINTER: falso });
	assert.equal(r.status, 2, `esperaba 2, salió ${r.status}: ${r.stdout}${r.stderr}`);
	assert.match(r.stderr, /salió con 3 sin declarar errores/);
});
