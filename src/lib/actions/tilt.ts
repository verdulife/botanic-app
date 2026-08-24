export type TiltOptions = {
	maxDeg?: number;
};

type DeviceOrientationEventStatic = typeof DeviceOrientationEvent & {
	requestPermission?: () => Promise<"granted" | "denied">;
};

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Tilt interactivo en perspectiva con sombra dinámica y reflejo cálido:
 * ratón/dedo (Pointer Events) y giroscopio solo cuando el navegador no exige
 * pedir permiso (iOS lo pide → dedo). Solo `transform`/`box-shadow`/`opacity`;
 * no-op con prefers-reduced-motion.
 */
export function tilt(node: HTMLElement, options: TiltOptions = {}) {
	const maxDeg = options.maxDeg ?? 12;

	if (
		typeof window === "undefined" ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		return {
			destroy() {},
		};
	}

	node.style.willChange = "transform";
	node.style.transition = "transform 150ms ease-out, box-shadow 150ms ease-out";
	if (getComputedStyle(node).position === "static") {
		node.style.position = "relative";
	}

	const borderRadius = getComputedStyle(node).borderRadius || "0.75rem";
	const glare = document.createElement("div");
	glare.setAttribute("aria-hidden", "true");
	glare.style.cssText = [
		"position:absolute",
		"inset:0",
		"pointer-events:none",
		`border-radius:${borderRadius}`,
		"background:radial-gradient(circle at var(--glare-x,50%) var(--glare-y,30%), rgba(255,252,235,0.7) 0%, rgba(255,252,235,0) 55%)",
		"opacity:var(--glare-o,0)",
		"transition:opacity 200ms ease-out",
	].join(";");
	node.appendChild(glare);

	let raf = 0;

	function apply(rotationX: number, rotationY: number): void {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			node.style.transform = `rotateX(${rotationX.toFixed(2)}deg) rotateY(${rotationY.toFixed(2)}deg)`;

			// Sombra realista: se desplaza contra el giro y crece al "elevarse"
			const liftX = rotationY / maxDeg;
			const liftY = rotationX / maxDeg;
			const mag = Math.min(1.4, Math.hypot(liftX, liftY));
			const ox = (-liftX * 16).toFixed(1);
			const oy = (10 + mag * 10).toFixed(1);
			const blur = (20 + mag * 26).toFixed(1);
			const alpha = (0.26 + mag * 0.14).toFixed(3);
			node.style.boxShadow = `${ox}px ${oy}px ${blur}px -6px rgba(15, 31, 19, ${alpha})`;

			// Reflejo cálido: brillo que viaja hacia el lado elevado
			node.style.setProperty(
				"--glare-x",
				`${((rotationY / maxDeg) * 40 + 50).toFixed(1)}%`
			);
			node.style.setProperty(
				"--glare-y",
				`${((rotationX / maxDeg) * 40 + 35).toFixed(1)}%`
			);
			node.style.setProperty("--glare-o", Math.min(0.38, mag * 0.5).toFixed(3));
		});
	}

	function reset(): void {
		apply(0, 0);
		node.style.setProperty("--glare-o", "0");
	}

	function onPointerMove(event: PointerEvent): void {
		const rect = node.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;
		const x = (event.clientX - rect.left) / rect.width - 0.5;
		const y = (event.clientY - rect.top) / rect.height - 0.5;
		apply(clamp(-y * maxDeg * 2, -maxDeg, maxDeg), clamp(x * maxDeg * 2, -maxDeg, maxDeg));
	}

	// Giroscopio: normaliza respecto a la postura inicial para no saltar al activarse
	let baseBeta: number | null = null;
	let baseGamma: number | null = null;

	function onDeviceOrientation(event: DeviceOrientationEvent): void {
		const { beta, gamma } = event;
		if (beta === null || gamma === null) return;
		baseBeta ??= beta;
		baseGamma ??= gamma;
		const rotationY = clamp(((gamma - baseGamma) / 25) * maxDeg, -maxDeg, maxDeg);
		const rotationX = clamp((-(beta - baseBeta) / 25) * maxDeg, -maxDeg, maxDeg);
		apply(rotationX, rotationY);
	}

	const deviceOrientation = window.DeviceOrientationEvent as
		| DeviceOrientationEventStatic
		| undefined;
	const gyroNeedsPermission =
		typeof deviceOrientation?.requestPermission === "function";

	node.addEventListener("pointermove", onPointerMove);
	node.addEventListener("pointerleave", reset);
	node.addEventListener("pointercancel", reset);

	let gyroActive = false;
	function tryEnableGyro(): void {
		if (gyroActive || gyroNeedsPermission) return;
		gyroActive = true;
		window.addEventListener("deviceorientation", onDeviceOrientation);
	}
	// Android expone eventos sin permiso; iOS los bloquea hasta requestPermission()
	window.addEventListener("deviceorientation", tryEnableGyro, { once: true });

	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener("pointermove", onPointerMove);
			node.removeEventListener("pointerleave", reset);
			node.removeEventListener("pointercancel", reset);
			window.removeEventListener("deviceorientation", tryEnableGyro);
			window.removeEventListener("deviceorientation", onDeviceOrientation);
			glare.remove();
			node.style.willChange = "";
			node.style.transition = "";
			node.style.transform = "";
			node.style.boxShadow = "";
			node.style.position = "";
			node.style.removeProperty("--glare-x");
			node.style.removeProperty("--glare-y");
			node.style.removeProperty("--glare-o");
		},
	};
}
