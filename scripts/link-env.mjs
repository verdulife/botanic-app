#!/usr/bin/env node
/**
 * Enlaza el .env.local del worktree principal en el worktree actual.
 *
 * Cada worktree es un directorio propio, así que no hereda el fichero de
 * entorno ni las claves. Enlazarlo evita duplicar secretos por el disco: hay
 * un solo .env.local real, el del worktree principal, y el resto apunta a él.
 *
 * Uso: pnpm env:link
 *
 * Sale con 0 si ya estaba, si acaba de enlazarlo o si no hay nada que enlazar.
 * Sale con 1 solo cuando el worktree principal no tiene .env.local.
 *
 * Nota: el agente no puede ejecutar esto, porque la política de seguridad
 * bloquea cualquier acceso a rutas de entorno. Lo corre la persona.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readlinkSync, symlinkSync } from 'node:fs';
import path from 'node:path';

const ENV_FILE = '.env.local';

const gitCommon = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
	encoding: 'utf8'
}).trim();

// El directorio común de un worktree es el `.git` del worktree principal, así
// que su padre es la raíz donde vive el fichero real.
const mainRoot = path.dirname(gitCommon);
const source = path.join(mainRoot, ENV_FILE);
const target = path.join(process.cwd(), ENV_FILE);

if (existsSync(target) || isBrokenLink(target)) {
	const actual = isBrokenLink(target) ? readlinkSync(target) : source;
	console.log(`${ENV_FILE} ya existe en este worktree (${actual}). Nada que hacer.`);
	process.exit(0);
}

if (!existsSync(source)) {
	console.error(`No hay ${ENV_FILE} en el worktree principal: ${source}`);
	console.error('Créalo ahí y vuelve a ejecutar esto.');
	process.exit(1);
}

symlinkSync(path.relative(path.dirname(target), source), target);
console.log(`Enlazado ${target} -> ${readlinkSync(target)}`);

function isBrokenLink(file) {
	try {
		return lstatSync(file).isSymbolicLink() && !existsSync(file);
	} catch {
		return false;
	}
}
