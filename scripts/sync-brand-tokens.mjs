import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DESIGN = join(ROOT, "DESIGN.md");
const OUT = join(ROOT, "video", "src", "brand.generated.ts");

function readFrontmatter(file) {
	const text = readFileSync(file, "utf8");
	const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
	if (!m) throw new Error(`No se encontró frontmatter en ${file}`);
	return m[1].replace(/\r\n/g, "\n");
}

function parseBlock(block, indent = 0) {
	const result = {};
	const lines = block.split("\n");
	const baseIndent = lines
		.filter((l) => l.trim().length > 0)
		.map((l) => l.match(/^(\s*)/)[1].length)
		.reduce((min, n) => Math.min(min, n), Infinity);
	const prefix = " ".repeat(baseIndent);
	const root = {};
	const stack = [{ indent: -1, obj: root }];
	for (const raw of lines) {
		const line = raw.trimEnd();
		if (!line) continue;
		if (line.trim().startsWith("#") || line.trim().startsWith("description:")) continue;
		const lineIndent = line.match(/^(\s*)/)[1].length;
		const keyMatch = line.match(/^\s*([\w-]+):\s*(.*?)\s*$/);
		if (!keyMatch) continue;
		const [, key, rawVal] = keyMatch;
		while (stack.length > 1 && stack[stack.length - 1].indent >= lineIndent) stack.pop();
		const parent = stack[stack.length - 1].obj;
		if (rawVal === "" || rawVal === undefined) {
			const child = {};
			parent[toCamel(key)] = child;
			stack.push({ indent: lineIndent, obj: child });
		} else {
			parent[toCamel(key)] = stripQuotes(rawVal);
		}
	}
	return root;
}

function toCamel(s) {
	return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function stripQuotes(v) {
	const t = v.trim();
	if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
		return t.slice(1, -1);
	}
	return t;
}

const fm = readFrontmatter(DESIGN);
const parsed = parseBlock(fm);
const colors = parsed.colors ?? {};
const typography = parsed.typography ?? {};
const rounded = parsed.rounded ?? {};

const flatColors = Object.entries(colors)
	.map(([k, v]) => `  ${jsKey(k)}: ${JSON.stringify(v)},`)
	.join("\n");

const fontFamilies = {
	display: typography.display
		? typography.display.split(",")[0].trim().replace(/^["']|["']$/g, "")
		: "Fraunces Variable",
	sans: typography.sans
		? typography.sans.split(",")[0].trim().replace(/^["']|["']$/g, "")
		: "Inter Variable",
	mono: typography.mono
		? typography.mono.split(",")[0].trim().replace(/^["']|["']$/g, "")
		: "JetBrains Mono Variable",
};

const flatRadius = Object.entries(rounded)
	.map(([k, v]) => `  ${jsKey(k)}: ${JSON.stringify(v)},`)
	.join("\n");

function jsKey(k) {
	// Si la clave es un identificador JS válido sin guiones ni números al inicio, úsala literal.
	// Si no, la serializa como string key para que TypeScript no se queje.
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

const banner = `// ⚠️  AUTOGENERADO por scripts/sync-brand-tokens.mjs desde DESIGN.md
// No editar a mano. Si cambias tokens, edita el frontmatter de DESIGN.md
// y ejecuta \`bun run tokens\`.

export const COLORS = {
${flatColors}
} as const;

export const FONT_FAMILY = ${JSON.stringify(fontFamilies.sans)};

export const FONT_FAMILIES = {
${Object.entries(fontFamilies)
	.map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
	.join("\n")}
} as const;

export const RADIUS = {
${flatRadius}
} as const;

export type ColorToken = keyof typeof COLORS;
export type RadiusToken = keyof typeof RADIUS;
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, banner, "utf8");
console.log(`OK ${OUT}`);
console.log(
	`  ${Object.keys(colors).length} colores · ${Object.keys(rounded).length} radios · fuentes: ${Object.values(fontFamilies).join(", ")}`,
);
