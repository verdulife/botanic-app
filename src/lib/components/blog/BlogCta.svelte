<script lang="ts">
	import { tick } from "svelte";
	import { fly } from "svelte/transition";
	import WaitlistForm from "$lib/components/waitlist/WaitlistForm.svelte";
	import Logo from "$lib/components/Logo.svelte";
	import { fireConfetti } from "$lib/confetti";
	import { Button } from "$lib/components/ui/button";
	import {
		renderFounderCard,
		founderCardFileName,
		formatPosition,
		FOUNDER_CARD_MAX_POSITION,
	} from "$lib/founder-card";
	import { tilt } from "$lib/actions/tilt";

	type Variant = "new" | "duplicate";

	type SuccessPayload = {
		alreadyRegistered: boolean;
		email: string;
		position?: number;
	};

	let {
		title = "Consigue tu pase para el día uno de Botanic",
		subtitle = "Apúntate a la lista de espera y te avisamos en cuanto abramos: acceso anticipado y cero spam.",
	}: { title?: string; subtitle?: string } = $props();

	const SITE_URL = "https://www.botanicapp.es/";
	const SHARE_HASHTAGS = "#Botanic #SemillaFundadora #PlantLovers";

	const CONFIRMATION: Record<Variant, { heading: string; body: string }> = {
		new: {
			heading: "¡Gracias! Ya eres Semilla fundadora",
			body: "Te hemos enviado un email de confirmación; si tarda, mira en la carpeta de spam.",
		},
		duplicate: {
			heading: "¡Gracias por volver! Tu Semilla seguía aquí",
			body: "No hace falta nada más de tu parte: te avisaremos en cuanto abramos Botanic.",
		},
	};

	const confirmBody = $derived.by(() => {
		if (
			variant === "duplicate" &&
			position !== null &&
			position <= FOUNDER_CARD_MAX_POSITION
		) {
			return `Tu puesto ${formatPosition(position)} sigue guardado desde el primer día. Nada más que hacer: te avisaremos en cuanto abramos Botanic.`;
		}
		return CONFIRMATION[variant].body;
	});

	let flipped = $state(false);
	let variant = $state<Variant>("new");
	let backHeading = $state<HTMLHeadingElement | null>(null);

	let position = $state<number | null>(null);
	let cardUrl = $state<string | null>(null);
	let cardBlob = $state<Blob | null>(null);
	let cardPending = $state(false);
	let copied = $state(false);

	let wrapper = $state<HTMLElement | null>(null);
	let frontInner = $state<HTMLElement | null>(null);
	let backInner = $state<HTMLElement | null>(null);
	let wrapperHeight = $state<string | null>(null);

	// Altura del wrapper = cara activa (solo móvil; en desktop manda el formulario)
	function syncHeight(): void {
		if (typeof window === "undefined") return;
		if (window.matchMedia("(min-width: 768px)").matches) {
			wrapperHeight = null;
			return;
		}
		const inner = flipped ? backInner : frontInner;
		const face = inner?.parentElement;
		if (!inner || !face) return;
		const s = getComputedStyle(face);
		const padY = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
		const h = inner.offsetHeight + padY;
		if (h > 0) wrapperHeight = `${h}px`;
	}

	$effect(() => {
		void flipped;
		syncHeight();
	});

	$effect(() => {
		if (!frontInner || !backInner || !wrapper) return;
		const ro = new ResizeObserver(() => syncHeight());
		ro.observe(frontInner);
		ro.observe(backInner);
		const mq = window.matchMedia("(min-width: 768px)");
		mq.addEventListener("change", syncHeight);
		window.addEventListener("resize", syncHeight);
		return () => {
			ro.disconnect();
			mq.removeEventListener("change", syncHeight);
			window.removeEventListener("resize", syncHeight);
		};
	});

	const hasCard = $derived(
		position !== null && position <= FOUNDER_CARD_MAX_POSITION && cardUrl !== null
	);

	const dev = import.meta.env.DEV;

	async function generateCard(pos: number) {
		cardPending = true;
		try {
			const blob = await renderFounderCard(pos);
			if (cardUrl) URL.revokeObjectURL(cardUrl);
			cardBlob = blob;
			cardUrl = blob ? URL.createObjectURL(blob) : null;
		} catch {
			cardBlob = null;
			cardUrl = null;
		} finally {
			cardPending = false;
		}
	}

	function shareText(pos: number | null): string {
		const base =
			pos !== null
				? `Ya soy la Semilla fundadora ${formatPosition(pos)} de Botanic 🌱 Donde las plantas conocen a gente. Consigue la tuya:`
				: "Me he apuntado a la lista de espera de Botanic 🌱 Donde las plantas conocen a gente:";
		return `${base} ${SHARE_HASHTAGS}`;
	}

	async function copyCaption(): Promise<void> {
		try {
			await navigator.clipboard.writeText(`${shareText(position)} ${SITE_URL}`);
			copied = true;
			setTimeout(() => (copied = false), 2500);
		} catch {
			// Portapapeles no disponible (permisos del navegador)
		}
	}

	async function handleShare() {
		await copyCaption();
		const text = shareText(position);
		if (
			cardBlob &&
			position !== null &&
			typeof navigator.canShare === "function"
		) {
			const file = new File([cardBlob], founderCardFileName(position), {
				type: "image/png",
			});
			if (navigator.canShare({ files: [file] })) {
				try {
					await navigator.share({ files: [file], text, url: SITE_URL });
					return;
				} catch {
					return; // El usuario cerró el share sheet
				}
			}
		}
		// Sin Web Share de ficheros: el texto ya está copiado; la imagen, vía Descargar
	}

	async function handleSuccess(payload: SuccessPayload) {
		variant = payload.alreadyRegistered ? "duplicate" : "new";
		position = typeof payload.position === "number" ? payload.position : null;
		flipped = true;
		if (!payload.alreadyRegistered) void fireConfetti();
		if (position !== null && position <= FOUNDER_CARD_MAX_POSITION) {
			void generateCard(position);
		}
		await tick();
		backHeading?.focus();
	}

	function resetFlip() {
		flipped = false;
		variant = "new";
		position = null;
		copied = false;
	}
</script>

<section id="waitlist" class="relative scroll-mt-16 [perspective:1400px]">
	<div
		bind:this={wrapper}
		class="relative grid transition-[transform,height] duration-700 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
		style:transform={flipped ? "rotateY(-180deg)" : "rotateY(0deg)"}
		style:height={wrapperHeight ?? undefined}
	>
		<!-- Cara frontal -->
		<div
			class="relative overflow-hidden rounded-3xl bg-secondary/70 px-6 py-16 [grid-area:1/1] [backface-visibility:hidden] md:py-20"
			inert={flipped}
		>
			<div bind:this={frontInner} class="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
				<Logo class="h-6" />
				<h2 class="text-4xl leading-tight font-light text-balance text-still-950 md:text-6xl">
					{title}
				</h2>
				<p class="text-pretty text-muted-foreground">{subtitle}</p>
				<div class="mt-2 w-full">
					<WaitlistForm onsuccess={handleSuccess} />
				</div>
			</div>
		</div>

		<!-- Cara trasera -->
		<div
			class="relative flex flex-col overflow-hidden rounded-3xl bg-tranquil-200 px-6 py-10 [grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] md:py-20"
			inert={!flipped}
		>
			<img
				src="/images/leaves-texture.svg"
				alt=""
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-25"
			/>
			<div bind:this={backInner} class="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center md:h-full md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-x-12">
				<!-- Columna texto + acciones -->
				<div class="flex flex-col items-center gap-3 md:col-start-1 md:items-start md:text-left">
					<h2
						bind:this={backHeading}
						tabindex="-1"
						class="text-4xl leading-tight font-light text-balance text-still-950 outline-none md:text-5xl"
					>
						{CONFIRMATION[variant].heading}
					</h2>
					<p class="max-w-xl text-pretty text-still-800">{confirmBody}</p>
					<p class="max-w-md text-pretty text-base leading-snug text-still-800">
						De los primeros de Botanic, para siempre. Comparte tu tarjeta de Semilla fundadora.
					</p>
					<div class="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
						<Button
							onclick={handleShare}
							class="h-12 bg-tranquil-500 px-8 text-base text-still-950 hover:bg-tranquil-600"
						>
							Compartir
						</Button>
						{#if hasCard && cardUrl}
							<a
								href={cardUrl}
								download={founderCardFileName(position ?? 0)}
								class="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-base font-semibold hover:bg-muted"
							>
								Descargar
							</a>
						{/if}
					</div>
				</div>

				<!-- Columna tarjeta: absoluta en desktop para no estirar la fila -->
				<div class="relative flex flex-col items-center gap-3 md:absolute md:inset-0 md:col-start-2 md:row-start-1">
					<div class="mt-2 flex min-h-[22.5rem] flex-1 items-center justify-center md:mt-0 md:h-full md:min-h-0">
						{#if cardPending}
							<p class="eyebrow text-still-700" role="status">Preparando tu tarjeta…</p>
						{:else if hasCard && cardUrl}
							<div class="flex h-full items-center justify-center [perspective:700px]">
								<div use:tilt={{ maxDeg: 12 }} class="flex h-full rounded-xl shadow-sm">
									<img
										src={cardUrl}
										alt="Tu tarjeta de Semilla fundadora {formatPosition(position ?? 0)} de Botanic"
										class="block w-72 rounded-xl border border-still-300/60 md:h-auto md:max-h-full md:max-w-full md:w-auto"
									/>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Toast flotante: feedback del fallback de copiar enlace -->
			<div class="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center">
				{#if copied}
					<p
						role="status"
						transition:fly={{ y: 10, duration: 250 }}
						class="rounded-full bg-still-950/90 px-4 py-1.5 text-xs text-tranquil-100"
					>
						Enlace copiado — pégalo en tu publicación 🌿
					</p>
				{/if}
			</div>
		</div>
	</div>
</section>

{#if dev}
	<!-- Solo desarrollo: se elimina del bundle de producción (import.meta.env.DEV → false) -->
	<div class="fixed right-4 bottom-4 z-50 flex flex-col gap-1 rounded-xl border border-border bg-card p-2 shadow-sm">
		<p class="eyebrow px-1">Dev · flip</p>
		<button
			type="button"
			onclick={() => handleSuccess({ alreadyRegistered: false, email: "", position: 37 })}
			class="rounded-md border border-border px-2 py-1 text-left text-xs hover:bg-muted"
		>
			Simular alta nueva (#37)
		</button>
		<button
			type="button"
			onclick={() => handleSuccess({ alreadyRegistered: true, email: "", position: 37 })}
			class="rounded-md border border-border px-2 py-1 text-left text-xs hover:bg-muted"
		>
			Simular duplicado (#37)
		</button>
		<button
			type="button"
			onclick={() => handleSuccess({ alreadyRegistered: false, email: "", position: 1200 })}
			class="rounded-md border border-border px-2 py-1 text-left text-xs hover:bg-muted"
		>
			Simular sin tarjeta (&gt;999)
		</button>
		<button
			type="button"
			onclick={resetFlip}
			class="rounded-md border border-border px-2 py-1 text-left text-xs hover:bg-muted"
		>
			Volver
		</button>
	</div>
{/if}
