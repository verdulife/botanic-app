const CONFETTI_COLORS = ["#74AA7B", "#45844F", "#32693C", "#285431", "#7C766A", "#4A4238"];

export async function fireConfetti(): Promise<void> {
	if (
		typeof window === "undefined" ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		return;
	}
	try {
		const confetti = (await import("canvas-confetti")).default;
		confetti({
			particleCount: 280,
			spread: 90,
			startVelocity: 50,
			origin: { y: 0.7 },
			colors: CONFETTI_COLORS,
		});
	} catch {
		// canvas-confetti no disponible: celebración opcional, se ignora
	}
}
