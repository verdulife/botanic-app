import policyMd from "$lib/legal/politica-de-privacidad.md?raw";
import { marked } from "marked";

export const prerender = true;

const html = await marked.parse(policyMd, { gfm: true });

const titleMatch = policyMd.match(/^#\s+(.+)/m);
const title = titleMatch?.[1] ?? "Política de Privacidad";

const dateMatch = policyMd.match(/\*Última actualización:\s*(.+?)\*/);
const lastUpdated = dateMatch?.[1] ?? null;

export const load = () => ({ title, html, lastUpdated });
