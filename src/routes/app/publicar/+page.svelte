<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import AuthRequired from '$lib/components/wireframe/AuthRequired.svelte';
	import AutocompleteInput from '$lib/components/wireframe/AutocompleteInput.svelte';
	import PhotoAnalysis from '$lib/components/wireframe/PhotoAnalysis.svelte';
	import PhotoPicker from '$lib/components/wireframe/PhotoPicker.svelte';
	import { CATEGORIES, LOCATIONS, PLANT_TERMS } from '$lib/mock/seed-data';
	import type { CategorySlug } from '$lib/mock/seed-data';
	import { getPlantCareForSpecies } from '$lib/mock/plant-care';
	import {
		CIUDADES,
		COMUNIDADES,
		allProvincias,
		composeLocationLabel,
		type LocationScope
	} from '$lib/mock/locations';
	import type { Listing, ListingType, PlantSpecies } from '$lib/mock/listings';
	import { userListings } from '$lib/stores/user-listings.svelte';
	import { listingDraft, type ListingDraft } from '$lib/stores/listing-draft.svelte';
	import { wishes } from '$lib/stores/wishes.svelte';
	import type { Wish } from '$lib/mock/wishes';
	import { identifyPlant, type IdentifyResult } from '$lib/identify-plant';
	import { listingHref, randomListingToken } from '$lib/listing-url';
	import { Check, ChevronRight, Heart, Loader2, Share2, Sparkles } from 'lucide-svelte/icons';

	let { data } = $props();

	// ──────────────────────────────────────────────────────────
	// Estado del formulario (compartido entre fases)
	// ──────────────────────────────────────────────────────────

	let phase = $state(1);
	let published = $state<Listing | null>(null);
	let images = $state<string[]>([]);
	let title = $state('');
	let type = $state<ListingType[]>(['vender']);
	let price = $state('');
	let category = $state('');
	let plantSize = $state('');
	let speciesInput = $state('');
	let speciesMeta = $state<{ scientific?: string; genus?: string; family?: string; confidence?: number } | null>(null);
	let description = $state('');
	let locationInput = $state('');
	let locationPrefilled = $state(false);

	$effect(() => {
		if (locationPrefilled) return;
		locationPrefilled = true;
		if (data.profile?.location_label) locationInput = data.profile.location_label;
	});

	let errTitle = $state(false);
	let errPrice = $state(false);
	let errDescription = $state(false);
	let errLocation = $state(false);

	let titleInput = $state<HTMLInputElement | null>(null);
	let previewIdx = $state(0);
	let swipeStart: number | null = null;

	function onPreviewPointerDown(e: PointerEvent) {
		swipeStart = e.clientX;
	}

	function onPreviewPointerUp(e: PointerEvent) {
		if (swipeStart === null) return;
		const dx = e.clientX - swipeStart;
		swipeStart = null;
		const threshold = 40;
		if (Math.abs(dx) < threshold) return;
		if (dx < 0 && previewIdx < images.length - 1) previewIdx += 1;
		else if (dx > 0 && previewIdx > 0) previewIdx -= 1;
	}

	$effect(() => {
		if (previewIdx >= images.length) previewIdx = Math.max(0, images.length - 1);
	});

	$effect(() => {
		if (errTitle && title.trim()) errTitle = false;
	});
	$effect(() => {
		if (errPrice && price.trim() && Number(price) >= 0) errPrice = false;
	});
	$effect(() => {
		if (errDescription && description.trim()) errDescription = false;
	});
	$effect(() => {
		if (errLocation && locationInput.trim()) errLocation = false;
	});
	$effect(() => {
		if (errTitle && titleInput) titleInput.focus();
	});

	// ──────────────────────────────────────────────────────────
	// Identificación con Pl@ntNet (estado, usado por la navegación)
	// ──────────────────────────────────────────────────────────

	let analyzing = $state(false);
	let analysisError = $state<string | null>(null);
	let analysisCandidates = $state<IdentifyResult[]>([]);
	let identifiedCover = $state<string | null>(null);

	// ──────────────────────────────────────────────────────────
	// Fases / navegación
	// ──────────────────────────────────────────────────────────

	const ANALYZER_CATEGORIES: CategorySlug[] = ['plantas', 'esquejes'];

	const categorySlug = $derived<CategorySlug | undefined>(
		CATEGORIES.find((c) => c.name === category)?.slug
	);
	const isAnalysisCategory = $derived(
		!!categorySlug && ANALYZER_CATEGORIES.includes(categorySlug)
	);

	const SPECIES_CATEGORIES: CategorySlug[] = ['plantas', 'esquejes', 'semillas', 'bulbos'];
	const showSpecies = $derived(!!categorySlug && SPECIES_CATEGORIES.includes(categorySlug));

	const canContinue = $derived(
		phase === 1 ? !!category : phase === 2 ? images.length > 0 : phase === 3 ? !analyzing : true
	);

	function selectCategory(name: string) {
		if (name === category) return;
		category = name;
		speciesInput = '';
		speciesMeta = null;
	}

	function nextPhase() {
		if (phase === 1) {
			phase = 2;
		} else if (phase === 2) {
			phase = isAnalysisCategory ? 3 : 4;
		} else if (phase === 3) {
			phase = 4;
		}
	}

	// ──────────────────────────────────────────────────────────
	// Identificación con Pl@ntNet (lógica de la fase 3)
	// ──────────────────────────────────────────────────────────

	function sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function runAnalysis(cover: string) {
		analyzing = true;
		analysisError = null;
		analysisCandidates = [];
		identifiedCover = cover;
		try {
			// Mínimo 2s de feedback visual mientras llega la API.
			const [res] = await Promise.all([identifyPlant(cover), sleep(2000)]);
			analysisCandidates = res.results;
		} catch (err) {
			analysisError = err instanceof Error ? err.message : 'La identificación falló';
		} finally {
			analyzing = false;
		}
	}

	$effect(() => {
		if (phase !== 3) return;
		const cover = images[0];
		if (!cover || cover === identifiedCover) return;
		runAnalysis(cover);
	});

	function capitalize(s: string): string {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	function applyDetection(r: IdentifyResult) {
		speciesInput = r.name;
		speciesMeta = {
			scientific: r.scientific,
			genus: r.genus,
			family: r.family,
			confidence: r.confidence
		};
		if (!title.trim()) title = capitalize(r.name);
		if (!category) category = 'Plantas';
	}

	function clearDetection() {
		speciesInput = '';
		speciesMeta = null;
	}

	// ──────────────────────────────────────────────────────────
	// Descripción sugerida con IA (fase 4)
	// ──────────────────────────────────────────────────────────

	let suggesting = $state(false);
	let suggestError = $state<string | null>(null);

	async function suggestDescription() {
		if (suggesting) return;
		suggesting = true;
		suggestError = null;
		try {
			const speciesName = speciesInput.trim();
			const care = speciesName
				? getPlantCareForSpecies({ name: speciesName, scientific: speciesMeta?.scientific })
				: undefined;
			const res = await fetch('/api/suggest-description', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					species: speciesName || undefined,
					category,
					size: categorySlug === 'plantas' ? plantSize || undefined : undefined,
					type,
					location: locationInput.trim() || undefined,
					price: type.includes('vender') && price.trim() ? Number(price) : null,
					care: care
						? {
								watering: care.watering,
								light: care.light,
								toxicity: care.toxicity
							}
						: null
				})
			});
			const data = (await res.json().catch(() => null)) as
				| { title?: string; description?: string; error?: string }
				| null;
			if (!res.ok) throw new Error(data?.error ?? 'La IA falló');
			if (data?.title) title = data.title;
			if (data?.description) description = data.description;
		} catch (err) {
			suggestError = err instanceof Error ? err.message : 'La IA falló';
		} finally {
			suggesting = false;
		}
	}

	const analysisTitle = $derived(
		analyzing
			? 'Analizando fotografía'
			: analysisError
				? 'No pudimos analizar la fotografía'
				: analysisCandidates.length > 0
					? '¿Es esta tu planta?'
					: 'No pudimos identificar la planta'
	);

	const analysisDescription = $derived(
		analyzing
			? 'Estamos identificando la planta para rellenarte los campos.'
			: analysisError
				? 'Puedes reintentar o continuar sin identificar.'
				: analysisCandidates.length > 0
					? 'Toca la correcta si no es la primera. Todo es editable en el siguiente paso.'
					: 'Puedes continuar y rellenar la especie a mano.'
	);

	// ──────────────────────────────────────────────────────────
	// Borrador + aviso de datos sin guardar al salir
	// ──────────────────────────────────────────────────────────

	let exitDialogOpen = $state(false);
	let pendingNav: string | null = null;
	let allowNav = false;
	let draftHandled = $state(false);
	let activeDraftId = $state<string | null>(null);

	$effect(() => {
		listingDraft.load();
		const id = page.url.searchParams.get('draft');
		if (id) {
			const d = listingDraft.get(id);
			if (d) applyDraft(d);
		}
	});

	$effect(() => {
		if (!browser) return;
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsaved()) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', onBeforeUnload);
		return () => window.removeEventListener('beforeunload', onBeforeUnload);
	});

	function hasUnsaved(): boolean {
		if (published) return false;
		return (
			images.length > 0 ||
			title.trim() !== '' ||
			JSON.stringify(type) !== JSON.stringify(['vender']) ||
			price.trim() !== '' ||
			category !== '' ||
			plantSize !== '' ||
			speciesInput.trim() !== '' ||
			description.trim() !== '' ||
			locationInput.trim() !== (data.profile?.location_label ?? '') ||
			exchangeWishId !== null ||
			exchangeAccordion === 'nuevo-deseo' ||
			wishKeywords.trim() !== ''
		);
	}

	beforeNavigate(({ cancel, to }) => {
		if (allowNav) return;
		if (!to) return;
		if (!hasUnsaved()) return;
		cancel();
		pendingNav = to.url.href;
		exitDialogOpen = true;
	});

	function applyDraft(d: ListingDraft) {
		category = d.category;
		plantSize = d.plantSize;
		images = d.images;
		title = d.title;
		type = d.type.length ? d.type : ['vender'];
		price = typeof d.price === 'string' ? d.price : String(d.price ?? '');
		speciesInput = d.speciesInput;
		speciesMeta = d.speciesMeta;
		description = d.description;
		locationInput = d.locationInput;
		activeDraftId = d.id;
		draftHandled = true;
		phase = d.category ? 4 : 1;
	}

	function restoreMostRecent() {
		const d = listingDraft.mostRecent;
		if (d) applyDraft(d);
	}

	function discardDraft() {
		const d = listingDraft.mostRecent;
		if (d) listingDraft.remove(d.id);
		draftHandled = true;
	}

	function buildCurrentDraft(): ListingDraft {
		return {
			id: activeDraftId ?? newDraftId(),
			savedAt: new Date().toISOString(),
			category,
			plantSize,
			images,
			title,
			type,
			price,
			speciesInput,
			speciesMeta,
			description,
			locationInput
		};
	}

	function newDraftId(): string {
		return typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID()
			: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	}

	function saveDraftNow() {
		const draft = buildCurrentDraft();
		activeDraftId = draft.id;
		listingDraft.save(draft);
		allowNav = true;
		goto('/app/borradores');
	}

	function leaveNow() {
		allowNav = true;
		const url = pendingNav;
		exitDialogOpen = false;
		pendingNav = null;
		if (url) goto(url);
	}

	function saveAndLeave() {
		listingDraft.save(buildCurrentDraft());
		leaveNow();
	}

	function publishAnother() {
		published = null;
		phase = 1;
		images = [];
		title = '';
		type = ['vender'];
		price = '';
		category = '';
		plantSize = '';
		speciesInput = '';
		speciesMeta = null;
		description = '';
		locationInput = '';
		locationPrefilled = false;
		previewIdx = 0;
		exchangeWishId = null;
		exchangeAccordion = undefined;
		wishKeywords = '';
		wishError = false;
		wishLocationInput = '';
		wishAlert = true;
		wishCategory = 'Cualquiera';
		wishBudget = '';
		analysisCandidates = [];
		analysisError = null;
		identifiedCover = null;
		analyzing = false;
		suggestError = null;
		errTitle = false;
		errPrice = false;
		errDescription = false;
		errLocation = false;
	}

	async function sharePublished() {
		if (!published || typeof navigator === 'undefined') return;
		const url =
			typeof window !== 'undefined'
				? `${window.location.origin}${listingHref(published)}`
				: '';
		const data = { title: published.title, text: `Mira "${published.title}" en Botanic`, url };
		try {
			if (navigator.share) {
				await navigator.share(data);
			} else if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(`${data.title} — ${data.url}`);
			}
		} catch {
			// el usuario canceló o hubo un error; no hacer nada
		}
	}

	// ──────────────────────────────────────────────────────────
	// Intercambio: qué quieres a cambio (deseo existente o nuevo)
	// ──────────────────────────────────────────────────────────

	let exchangeWishId = $state<string | null>(null);
	let exchangeAccordion = $state<string | undefined>(undefined);
	let wishKeywords = $state('');
	let wishError = $state(false);
	let wishLocationInput = $state('');
	let wishAlert = $state(true);
	let wishCategory = $state('Cualquiera');
	let wishBudget = $state('');

	type WishLocationSuggestion = { scope: LocationScope; value: string; label: string };
	const wishLocationSuggestions: WishLocationSuggestion[] = [
		{ scope: 'pais', value: '', label: 'Todo el país' },
		...COMUNIDADES.map((c) => ({
			scope: 'comunidad' as const,
			value: c.name,
			label: composeLocationLabel('comunidad', c.name)
		})),
		...allProvincias().map((p) => ({
			scope: 'provincia' as const,
			value: p,
			label: composeLocationLabel('provincia', p)
		})),
		...CIUDADES.map((c) => ({
			scope: 'ciudad' as const,
			value: c,
			label: composeLocationLabel('ciudad', c)
		}))
	];
	const wishLocationLabels = wishLocationSuggestions.map((s) => s.label);

	function resolveWishLocation(): { scope: LocationScope | undefined; value: string; label: string } {
		const q = wishLocationInput.trim();
		if (!q) return { scope: 'pais', value: '', label: 'Todo el país' };
		const hit = wishLocationSuggestions.find((s) => s.label.toLowerCase() === q.toLowerCase());
		if (hit) return hit;
		return { scope: undefined, value: q, label: q };
	}

	function newWishId(): string {
		return typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID()
			: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	}

	function createWish() {
		const q = wishKeywords.trim();
		if (!q) {
			wishError = true;
			return;
		}
		const rawPrice = wishBudget.trim();
		const price = rawPrice ? Number(rawPrice) : null;
		const loc = resolveWishLocation();
		const wish: Wish = {
			id: newWishId(),
			keywords: q,
			category: wishCategory,
			priceMin: null,
			priceMax: price !== null && Number.isFinite(price) && price >= 0 ? price : null,
			location: loc.label,
			locationScope: loc.scope,
			status: 'activo',
			alert: wishAlert,
			matches: 0
		};
		wishes.add(wish);
		exchangeWishId = wish.id;
		exchangeAccordion = 'mis-deseos';
		wishKeywords = '';
		wishError = false;
		wishLocationInput = '';
		wishAlert = true;
		wishCategory = 'Cualquiera';
		wishBudget = '';
	}

	$effect(() => {
		if (!type.includes('cambiar')) exchangeWishId = null;
		if (type.includes('cambiar') && exchangeAccordion === undefined) {
			exchangeAccordion = wishes.list.length > 0 ? 'mis-deseos' : 'nuevo-deseo';
		}
	});

	// ──────────────────────────────────────────────────────────
	// Tipo de anuncio: Vender y Cambiar combinables; Regalar exclusivo.
	// ──────────────────────────────────────────────────────────

	const typeOptions: { value: ListingType; label: string }[] = [
		{ value: 'vender', label: 'Vender' },
		{ value: 'cambiar', label: 'Cambiar' },
		{ value: 'regalar', label: 'Regalar' }
	];

	const SIZE_OPTIONS = [
		{ value: 'Pequeña', hint: 'hasta 15 cm' },
		{ value: 'Mediana', hint: '15–40 cm' },
		{ value: 'Grande', hint: 'más de 40 cm' }
	];

	function toggleType(t: ListingType) {
		if (t === 'regalar') {
			type = ['regalar'];
			return;
		}
		const next = type.includes(t)
			? type.filter((x) => x !== t)
			: [...type.filter((x) => x !== 'regalar'), t];
		type = next.length ? next : ['vender'];
	}

	$effect(() => {
		if (!type.includes('vender')) errPrice = false;
	});

	const locationLabels = LOCATIONS.map((l) => l.label);

	// ──────────────────────────────────────────────────────────
	// Envío
	// ──────────────────────────────────────────────────────────

	function onSubmit() {
		const loc = LOCATIONS.find((l) => l.label === locationInput.trim());

		errTitle = !title.trim();
		errPrice = type.includes('vender') && (!price.trim() || !(Number(price) >= 0));
		errDescription = !description.trim();
		errLocation = !loc;

		if (errTitle || errPrice || errDescription || errLocation) {
			return;
		}

		const cat = CATEGORIES.find((c) => c.name === category)!;
		const displayName =
			data.profile?.full_name?.trim() ||
			data.profile?.username ||
			data.user?.email?.split('@')[0] ||
			'Vendedor';

		const species: PlantSpecies | undefined = speciesInput.trim()
			? {
					name: speciesInput.trim(),
					scientific: speciesMeta?.scientific,
					genus: speciesMeta?.genus,
					family: speciesMeta?.family,
					confidence: speciesMeta?.confidence,
					source: speciesMeta?.scientific ? 'plantnet' : 'manual'
				}
			: undefined;

		const listing: Listing = {
			id: randomListingToken(),
			title: title.trim(),
			price: type.includes('regalar') ? 0 : Number(price) || 0,
			category: cat.name,
			categorySlug: cat.slug,
			location: loc!.label,
			seller: displayName,
			sellerInfo: {
				username: data.profile?.username ?? 'usuario',
				full_name: displayName,
				bio: data.profile?.bio ?? '',
				city: loc!.label,
				email: data.user?.email ?? '',
				rating: 0,
				reviewCount: 0
			},
			images,
			type,
			coordinates: {
				lat: loc!.lat + (Math.random() - 0.5) * 0.004,
				lng: loc!.lng + (Math.random() - 0.5) * 0.004
			},
			datePosted: new Date(),
			description: description.trim(),
			species,
			size: categorySlug === 'plantas' ? plantSize || undefined : undefined,
			wishId: type.includes('cambiar') && exchangeWishId ? exchangeWishId : undefined
		};

		userListings.add(listing);
		if (activeDraftId) listingDraft.remove(activeDraftId);
		draftHandled = true;
		published = listing;
	}
</script>

<svelte:head>
	<title>Publicar anuncio · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	{#if data.user}
		{#if published}
			<section class="flex flex-col items-center gap-5 text-center">
				<div
					class="bg-primary/15 text-primary mt-4 flex size-16 items-center justify-center rounded-full"
				>
					<Check class="size-8" />
				</div>
				<div class="flex flex-col gap-1">
					<h2 class="text-3xl font-medium">¡Anuncio publicado!</h2>
					<p class="text-muted-foreground text-sm">
						Ya está visible para quien busca {published.category}.
					</p>
				</div>

				<a
					href={listingHref(published)}
					class="bg-card ring-foreground/10 flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1"
				>
					<div class="bg-muted h-16 w-12 shrink-0 overflow-hidden rounded-lg">
						{#if published.images[0]}
							<img src={published.images[0]} alt="" class="h-full w-full object-cover" />
						{/if}
					</div>
					<span class="flex min-w-0 flex-1 flex-col">
						<span class="truncate text-sm font-medium">{published.title}</span>
						<span class="text-muted-foreground text-xs">
							{published.type.includes('regalar')
								? 'Gratis'
								: `${published.price} €`}{' '}
							· {published.location}
						</span>
					</span>
					<ChevronRight class="text-muted-foreground size-4 shrink-0" />
				</a>

				<div class="flex w-full flex-col gap-2">
					<Button href={listingHref(published)} class="h-12 w-full">
						Ver mi anuncio
					</Button>
					<Button variant="outline" class="h-12 w-full" onclick={sharePublished}>
						<Share2 class="size-4" />
						Compartir
					</Button>
					<Button variant="outline" class="h-12 w-full" onclick={publishAnother}>
						Publicar otro anuncio
					</Button>
					<a
						href="/app/mis-anuncios"
						class="text-muted-foreground hover:text-foreground text-sm font-medium underline transition-colors"
					>
						Ir a Mis anuncios
					</a>
				</div>

				<p class="text-muted-foreground max-w-sm text-xs">
					Consejo: responde rápido a los mensajes para cerrar el trato.
				</p>
			</section>
		{:else}
			{#if listingDraft.list.length > 0 && !draftHandled}
			<div class="bg-card ring-foreground/10 flex flex-col gap-3 rounded-xl p-4 ring-1">
				<div class="flex flex-col gap-0.5">
					<p class="text-sm font-medium">Tienes un borrador guardado</p>
					<p class="text-muted-foreground text-xs">
						¿Quieres retomar el anuncio donde lo dejaste?
					</p>
				</div>
				<div class="flex gap-2">
					<Button type="button" class="h-11 flex-1" onclick={restoreMostRecent}>
						Continuar borrador
					</Button>
					<Button type="button" variant="ghost" class="h-11" onclick={discardDraft}>
						Descartar
					</Button>
				</div>
				{#if listingDraft.list.length > 1}
					<a
						href="/app/borradores"
						class="text-muted-foreground hover:text-foreground text-xs font-medium underline transition-colors"
					>
						Ver todos los borradores ({listingDraft.list.length})
					</a>
				{/if}
			</div>
		{/if}

		<form
			onsubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
			class="flex flex-col gap-5"
		>
			{#if phase === 1}
				<section class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<h2 class="text-3xl font-medium">¿Qué quieres publicar?</h2>
						<p class="text-muted-foreground text-sm">
							Elige la categoría. Si es una planta o un esqueje, podremos identificar
							la especie desde la foto y rellenarte los campos.
						</p>
					</div>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{#each CATEGORIES as c (c.slug)}
							<button
								type="button"
								onclick={() => selectCategory(c.name)}
								aria-pressed={category === c.name}
								class={[
									'rounded-xl border p-3 text-left text-sm font-medium transition-colors',
									category === c.name
										? 'bg-foreground text-background border-foreground'
										: 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
								].join(' ')}
							>
								{c.name}
							</button>
						{/each}
					</div>

					{#if categorySlug === 'plantas'}
						<div class="flex flex-col gap-2">
							<Label class="text-sm font-medium">Tamaño</Label>
							<p class="text-muted-foreground text-xs">
								¿Qué tamaño tiene la planta? Lo tendremos en cuenta para la descripción.
							</p>
							<div class="grid grid-cols-3 gap-2">
								{#each SIZE_OPTIONS as s}
									<button
										type="button"
										onclick={() => (plantSize = s.value)}
										aria-pressed={plantSize === s.value}
										class={[
											'rounded-xl border p-3 text-center transition-colors',
											plantSize === s.value
												? 'bg-foreground text-background border-foreground'
												: 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
										].join(' ')}
									>
										<span class="block text-sm font-medium">{s.value}</span>
										<span
											class={[
												'block text-[10px]',
												plantSize === s.value ? 'text-background/70' : ''
											].join(' ')}
										>
											{s.hint}
										</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</section>
			{:else if phase === 2}
				<section class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<h2 class="text-3xl font-medium">Añade fotos</h2>
						<p class="text-muted-foreground text-sm">
							Añade entre 1 y 5 fotos.
						</p>
					</div>
					<Card.Root class="gap-0 overflow-visible py-0">
						<Card.Content class="py-5">
							<PhotoPicker bind:images {categorySlug} />
						</Card.Content>
					</Card.Root>
				</section>
			{:else if phase === 3}
				<section class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<h2 class="text-3xl font-medium">{analysisTitle}</h2>
						<p class="text-muted-foreground text-sm">
							{analysisDescription}
						</p>
					</div>
					<PhotoAnalysis
						cover={images[0] ?? ''}
						{analyzing}
						error={analysisError}
						candidates={analysisCandidates}
						onPick={applyDetection}
						onNone={clearDetection}
						onRetry={() => runAnalysis(images[0] ?? '')}
					/>
				</section>
			{:else}
				<section class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<h2 class="text-3xl font-medium">Detalles del anuncio</h2>
						<p class="text-muted-foreground text-sm">
							Completa el resto de campos y publica.
						</p>
					</div>

					<div
						class="bg-card ring-foreground/10 flex items-center justify-between rounded-xl p-3 ring-1"
					>
						<span class="text-muted-foreground text-sm">
							Categoría: <span class="text-foreground font-medium">{category}</span>
						</span>
						<button
							type="button"
							onclick={() => (phase = 1)}
							class="text-muted-foreground hover:text-foreground text-xs font-medium underline transition-colors"
						>
							Cambiar
						</button>
					</div>

					<div
						class="bg-card ring-foreground/10 flex flex-col gap-3 rounded-xl p-3 ring-1"
					>
						<div class="flex items-center justify-between">
							<p class="text-sm font-medium">Fotos del anuncio</p>
							<button
								type="button"
								onclick={() => (phase = 2)}
								class="text-muted-foreground hover:text-foreground text-xs font-medium underline transition-colors"
							>
								Editar fotos
							</button>
						</div>
						<div
							role="group"
							aria-roledescription="carrusel"
							aria-label="Fotos del anuncio"
							class="bg-muted relative aspect-[4/5] w-full max-h-56 overflow-hidden rounded-lg ring-1 ring-foreground/10"
							style="touch-action: pan-y"
							onpointerdown={onPreviewPointerDown}
							onpointerup={onPreviewPointerUp}
							onpointercancel={onPreviewPointerUp}
						>
							<div
								class="flex h-full transition-transform duration-300 ease-out"
								style="transform: translateX(-{previewIdx * 100}%);"
							>
								{#each images as src, i (src)}
									<img
										src={src}
										alt={`Foto ${i + 1} del anuncio`}
										class="h-full w-full shrink-0 object-cover"
										draggable="false"
									/>
								{/each}
							</div>
						</div>
						{#if images.length > 1}
							<div class="flex items-center justify-center gap-1.5">
								{#each images as _, i}
									<span
										class={[
											'h-1.5 rounded-full transition-all duration-300',
											i === previewIdx
												? 'bg-foreground w-4'
												: 'bg-muted-foreground/40 w-1.5'
										].join(' ')}
										aria-hidden="true"
									></span>
								{/each}
							</div>
						{/if}
					</div>

					<div
						class="bg-card ring-foreground/10 flex flex-col gap-4 rounded-xl p-4 ring-1"
					>
						<div class="flex flex-col gap-2">
							<Label for="title" class="text-sm font-medium">Título</Label>
							<Input
								bind:ref={titleInput}
								id="title"
								type="text"
								placeholder="Ej. Monstera deliciosa en maceta de 12cm"
								aria-invalid={errTitle}
								bind:value={title}
								class="h-12"
							/>
							{#if errTitle}
								<p class="text-destructive text-xs">Escribe un título para el anuncio.</p>
							{/if}
						</div>
						<div class="flex flex-col gap-2">
							<div class="flex items-center justify-between gap-2">
								<Label for="description" class="text-sm font-medium">Descripción</Label>
								<button
									type="button"
									onclick={suggestDescription}
									disabled={suggesting}
									class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50"
								>
									{#if suggesting}
										<Loader2 class="size-3.5 animate-spin" />
										Sugiriendo…
									{:else}
										<Sparkles class="size-3.5" />
										Sugerir con IA
									{/if}
								</button>
							</div>
							<Textarea
								id="description"
								rows={5}
								placeholder="Cuenta el estado, tamaño, por qué lo vendes…"
								aria-invalid={errDescription}
								bind:value={description}
							/>
							{#if suggestError}
								<p class="text-destructive text-xs">{suggestError}</p>
							{/if}
							{#if errDescription}
								<p class="text-destructive text-xs">
									Añade una descripción para que la vean los demás.
								</p>
							{/if}
						</div>
					</div>

					<Card.Root class="gap-0 overflow-visible py-0">
						<Card.Content class="flex flex-col gap-5 py-6">
							<div class="flex flex-col gap-2">
								<Label class="text-sm font-medium">Tipo de anuncio</Label>
								<div class="flex flex-wrap gap-2">
									{#each typeOptions as t}
										<button
											type="button"
											onclick={() => toggleType(t.value)}
											aria-pressed={type.includes(t.value)}
											class={[
												'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
												type.includes(t.value)
													? 'bg-muted border-border text-foreground'
													: 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
											].join(' ')}
										>
											{t.label}
										</button>
									{/each}
								</div>
								<p class="text-muted-foreground text-xs">
									Puedes vender y cambiar a la vez. Regalar es exclusivo.
								</p>
							</div>

							{#if showSpecies}
								<div class="flex flex-col gap-2">
									<Label for="species" class="text-sm font-medium">
										Especie
										<span class="text-muted-foreground font-normal"> (opcional)</span>
									</Label>
									<AutocompleteInput
										id="species"
										items={PLANT_TERMS}
										placeholder="Ej. Monstera deliciosa…"
										ariaLabel="Especie de la planta"
										bind:value={speciesInput}
									/>
								</div>
							{/if}

							{#if type.includes('regalar')}
								<div class="bg-muted/50 text-muted-foreground rounded-xl border p-3 text-sm">
									Este anuncio será <span class="text-foreground font-medium">gratis</span>.
									Se mostrará con la etiqueta «Regalo».
								</div>
							{:else}
								<div class="flex flex-col gap-2">
									<Label for="price" class="text-sm font-medium">
										Precio
										{#if type.includes('cambiar') && !type.includes('vender')}
											<span class="text-muted-foreground font-normal"> (opcional)</span>
										{/if}
									</Label>
									<div class="relative">
										<Input
											id="price"
											type="number"
											min="0"
											step="0.5"
											placeholder={
												type.includes('cambiar') && !type.includes('vender')
													? 'Precio orientativo'
													: '0'
											}
											aria-invalid={errPrice}
											value={price}
											oninput={(e) =>
												(price = (e.currentTarget as HTMLInputElement).value)}
											class="h-12 pr-9"
										/>
										<span
											class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm"
											>€</span
										>
									</div>
									{#if errPrice}
										<p class="text-destructive text-xs">
											Indica un precio válido.
										</p>
									{/if}
								</div>
							{/if}

							<div class="flex flex-col gap-2">
								<Label for="location" class="text-sm font-medium">Ubicación</Label>
								<AutocompleteInput
									id="location"
									items={locationLabels}
									placeholder="Dónde está la planta…"
									ariaLabel="Ubicación del anuncio"
									bind:value={locationInput}
									error={errLocation}
								/>
								{#if errLocation}
									<p class="text-destructive text-xs">
										Elige una ubicación de la lista.
									</p>
								{/if}
								<p class="text-muted-foreground text-xs">
									Se muestra el barrio aproximado, no tu dirección exacta.
								</p>
							</div>
						</Card.Content>
					</Card.Root>

					{#if type.includes('cambiar')}
						<div class="bg-card ring-foreground/10 flex flex-col gap-3 rounded-xl p-4 ring-1">
							<div class="flex flex-col gap-0.5">
								<p class="text-sm font-medium">¿Qué quieres a cambio?</p>
								<p class="text-muted-foreground text-xs">
									Elige uno de tus deseos o crea uno nuevo para tu intercambio.
								</p>
							</div>

							<Accordion.Root
								type="single"
								value={exchangeAccordion}
								onValueChange={(v) => (exchangeAccordion = v)}
								class="flex flex-col gap-2"
							>
								{#if wishes.list.length > 0}
									<Accordion.Item
										value="mis-deseos"
										class="border-border overflow-hidden rounded-xl ring-1 ring-foreground/10"
									>
										<Accordion.Trigger class="px-4 py-3">
											Elegir de mis deseos
										</Accordion.Trigger>
										<Accordion.Content>
											<ul class="divide-border divide-y">
												{#each wishes.list as w (w.id)}
													<li>
														<button
															type="button"
															onclick={() => (exchangeWishId = w.id)}
															aria-pressed={exchangeWishId === w.id}
															class="hover:bg-muted flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
															class:bg-muted={exchangeWishId === w.id}
														>
															<div
																class="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md"
															>
																<Heart class="size-5" />
															</div>
															<span class="flex min-w-0 flex-1 flex-col">
																<span class="truncate text-sm font-medium">{w.keywords}</span>
																<span class="text-muted-foreground truncate text-xs">{w.location}</span>
															</span>
															{#if exchangeWishId === w.id}
																<Check class="size-4 shrink-0" />
															{/if}
														</button>
													</li>
												{/each}
											</ul>
										</Accordion.Content>
									</Accordion.Item>
								{/if}

								<Accordion.Item
									value="nuevo-deseo"
									class="border-border overflow-hidden rounded-xl ring-1 ring-foreground/10"
								>
									<Accordion.Trigger class="px-4 py-3">
										Crear un nuevo deseo
									</Accordion.Trigger>
									<Accordion.Content class="px-4">
										<div class="flex flex-col gap-3">
											<div class="flex flex-col gap-2">
												<Label for="wish-keywords" class="text-sm font-medium">
													¿Qué buscas a cambio?
												</Label>
												<AutocompleteInput
													id="wish-keywords"
													items={PLANT_TERMS}
													placeholder="Ej. Monstera deliciosa…"
													ariaLabel="Qué buscas a cambio"
													bind:value={wishKeywords}
													error={wishError}
												/>
												{#if wishError}
													<p class="text-destructive text-xs">Escribe qué quieres a cambio.</p>
												{/if}
											</div>

											<div class="flex flex-col gap-2">
												<Label for="wish-location" class="text-sm font-medium">
													¿Dónde quieres encontrarlo?
												</Label>
												<AutocompleteInput
													id="wish-location"
													items={wishLocationLabels}
													placeholder="Todo el país, una ciudad…"
													ariaLabel="Dónde quieres encontrarlo"
													bind:value={wishLocationInput}
												/>
											</div>

											<div class="grid gap-3 sm:grid-cols-2">
												<div class="flex flex-col gap-2">
													<Label for="wish-category" class="text-sm font-medium">Categoría</Label>
													<Select.Root bind:value={wishCategory}>
														<Select.Trigger id="wish-category" class="h-11 w-full">
															<Select.Value />
														</Select.Trigger>
														<Select.Content>
															{#each ['Cualquiera', ...CATEGORIES.map((c) => c.name)] as c}
																<Select.Item value={c} label={c} />
															{/each}
														</Select.Content>
													</Select.Root>
												</div>
												<div class="flex flex-col gap-2">
													<Label for="wish-budget" class="text-sm font-medium">Presupuesto</Label>
													<div class="relative">
														<Input
															id="wish-budget"
															type="number"
															min="0"
															step="1"
															placeholder="Sin límite"
															value={wishBudget}
															oninput={(e) =>
																(wishBudget = (e.currentTarget as HTMLInputElement).value)}
															class="h-11 pr-9"
														/>
														<span
															class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm"
															>€</span
														>
													</div>
												</div>
											</div>

											<label class="flex cursor-pointer items-center gap-2 text-sm">
												<Checkbox
													checked={wishAlert}
													onCheckedChange={(v) => (wishAlert = v === true)}
												/>
												<span class="text-muted-foreground">
													Avisarme cuando haya coincidencias
												</span>
											</label>

											<div class="flex gap-2">
												<Button type="button" class="h-11 flex-1" onclick={createWish}>
													Crear deseo
												</Button>
												<Button
													type="button"
													variant="ghost"
													class="h-11"
													onclick={() => (exchangeAccordion = undefined)}
												>
													Cancelar
												</Button>
											</div>
										</div>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
						</div>
					{/if}
				</section>
			{/if}

			<nav class="flex items-center gap-2" aria-label="Navegación del formulario">
				{#if phase < 4}
					<Button
						type="button"
						onclick={nextPhase}
						disabled={!canContinue}
						class="h-12 flex-1"
					>
						{#if phase === 3 && analyzing}
							<Loader2 class="size-4 animate-spin" />
							Analizando…
						{:else}
							Continuar
						{/if}
					</Button>
				{:else}
					<Button
						type="button"
						variant="outline"
						onclick={saveDraftNow}
						class="h-12 shrink-0"
					>
						Guardar borrador
					</Button>
					<Button type="submit" class="h-12 flex-1">
						<Sparkles class="size-4" />
						Publicar anuncio
					</Button>
				{/if}
			</nav>
		</form>
		{/if}
	{:else}
		<AuthRequired title="Publica tu anuncio y llega a quien lo busca" />
	{/if}

	{#if exitDialogOpen}
		<div
			class="bg-background/60 fixed inset-0 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-label="Datos sin guardar"
		>
			<div class="bg-card ring-foreground/10 w-full max-w-sm rounded-2xl p-5 ring-1">
				<h3 class="text-lg font-medium">Tienes datos sin guardar</h3>
				<p class="text-muted-foreground mt-1 text-sm">
					¿Qué quieres hacer antes de salir?
				</p>
				<div class="mt-4 flex flex-col gap-2">
					<Button type="button" class="h-12 w-full" onclick={saveAndLeave}>
						Guardar borrador y salir
					</Button>
					<Button type="button" variant="outline" class="h-12 w-full" onclick={leaveNow}>
						Salir sin guardar
					</Button>
					<Button
						type="button"
						variant="ghost"
						class="h-12 w-full"
						onclick={() => (exitDialogOpen = false)}
					>
						Seguir editando
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>