import avisoMd from "$lib/legal/aviso-legal.md?raw";
import { marked } from "marked";

export const prerender = true;

const html = await marked.parse(avisoMd, { gfm: true });

const titleMatch = avisoMd.match(/^#\s+(.+)/m);
const title = titleMatch?.[1] ?? "Aviso Legal";

const dateMatch = avisoMd.match(/\*Última actualización:\s*(.+?)\*/);
const lastUpdated = dateMatch?.[1] ?? null;

export const load = () => ({ title, html, lastUpdated });
