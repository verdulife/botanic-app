export const AUTHORS = ["Albert", "Domadora de Gatos", "Laia"] as const;

export type Author = (typeof AUTHORS)[number];

const AUTHOR_DISPLAY: Record<string, string> = {
	Albert: "Albert",
	"Albert Verdú": "Albert",
	Laia: "Laia",
};

export function resolveAuthor(raw: unknown): string {
	const key = String(raw ?? "").trim();
	return AUTHOR_DISPLAY[key] ?? key;
}
