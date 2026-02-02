<script lang="ts">
    import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Footer from '$lib/components/footer.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data }: { data: PageData } = $props();

	let settings = $derived(data.settings);
	let horaires = $derived(data.horaires);
	let menus = $derived(data.menus);
	let media = $derived(data.media);
	let pocketbaseUrl = $derived(data.pocketbaseUrl);

	function getFileUrl(collectionId: string, recordId: string, filename: string): string {
		return `${pocketbaseUrl}/api/files/${collectionId}/${recordId}/${filename}`;
	}

	function getLogoUrl(): string {
		if (settings?.logo) {
			return getFileUrl('Site_Settings', settings.id, settings.logo);
		}
		return '';
	}

	// Helper pour obtenir l'URL d'un média par index dans le tableau
	function getMediaUrlByIndex(index: number): string {
		if (Array.isArray(media) && media[index]?.file) {
			return getFileUrl('Media', media[index].id, media[index].file);
		}
		// Fallback: si media est un seul objet, retourner son URL
		if (!Array.isArray(media) && media?.file) {
			return getFileUrl('Media', media.id, media.file);
		}
		return '';
	}

	// Helper pour obtenir l'alt d'un média par index
	function getMediaAltByIndex(index: number): string {
		if (Array.isArray(media) && media[index]?.alt) {
			return media[index].alt;
		}
		if (!Array.isArray(media) && media?.alt) {
			return media.alt;
		}
		return 'Restaurant Le Moulin';
	}

	function getMenuImageUrl(menu: any): string {
		if (menu?.image) {
			return getFileUrl('Menu', menu.id, menu.image);
		}
		return '';
	}

	function getMenuPdfUrl(menu: any): string {
		if (menu?.pdf) {
			return getFileUrl('Menu', menu.id, menu.pdf);
		}
		return '#';
	}

	function getMenuByCategory(category: string): any {
		return menus.find((m: any) => m.Categorie?.toLowerCase() === category.toLowerCase());
	}

	function sortHoraires(h: any[]): any[] {
		const jourOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
		return [...h].sort((a, b) => jourOrder.indexOf(a.Jour) - jourOrder.indexOf(b.Jour));
	}

	let sortedHoraires = $derived(sortHoraires(horaires));

</script>

<svelte:head>
	<title>{settings?.siteName || 'Le Moulin'} - Restaurant à Windsor</title>
	<meta name="description" content="Restaurant Le Moulin - Local. Chaleureux. Délicieux. Depuis 2007 à Windsor." />
</svelte:head>

<!-- ========== HEADER / NAVIGATION ========== -->
<Navbar {settings} {getLogoUrl} />

<!-- ========== HERO SECTION ========== -->
<section class=" relative h-screen min-h-[600px] flex items-center justify-center hero-parallax">
	<div class="absolute inset-0 bg-[var(--color-noir)]">
		<img 
			src={getMediaUrlByIndex(0)}
			alt="Restaurant Le Moulin - Façade"
			class="w-full h-full object-cover opacity-70"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
	</div>

	<div class="relative z-10 text-center text-[var(--color-creme)] px-4">
		<ScrollReveal direction="up" duration={900} distance={30}>
			<h1 class="text-5xl md:text-7xl font-serif mb-4 tracking-wider">
				Restaurant 
			</h1>
		</ScrollReveal>
		<ScrollReveal direction="up" delay={200} duration={900} distance={20}>
			<p class="text-lg md:text-xl mb-2 tracking-wide">
				{settings?.address || '2180 QC-161, Marston, QC G6B 2V8'}
			</p>
		</ScrollReveal>
		<ScrollReveal direction="up" delay={400} duration={900}>
			<a 
				href="https://order.ueat.io/integration/67231610-fef4-425a-b795-82f638e434ec/fr#/" 
				class="btn-outline-white inline-block mt-6"
			>
				Commander en ligne
			</a>
		</ScrollReveal>
	</div>
</section>

<!-- ========== SECTION PRÉSENTATION ========== -->
<section class=" py-20 px-6 bg-[var(--color-creme)]">
	<div class="max-w-4xl mx-auto text-center my-48">

			<h2 class="text-4xl md:text-5xl font-serif mb-12">
				<span class="text-[var(--color-noir)]">Local. Chaleureux.</span>
				<span class="italic text-[var(--color-brun)]"> Délicieux.</span>
			</h2>

		<ScrollReveal direction="up" delay={300} duration={1000}>
			<p class="text-[var(--color-noir)] text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
				Depuis 2007, le Restaurant Le Moulin n'est pas seulement une adresse à Windsor, c'est un véritable point de rassemblement familiale, un lieu les saveurs rencontrent les souvenirs.
			</p>
		</ScrollReveal>
		<ScrollReveal direction="up" delay={400} duration={1000}>
			<a href="#apropos" class="btn-dore inline-block">
				En savoir plus
			</a>
		</ScrollReveal>
	</div>
</section>

<!-- ========== SECTION MENU ========== -->
<section id="menu" class=" py-16 px-6 bg-[var(--color-creme)] mb-32 pb-48">
	<div class="max-w-5xl mx-auto">
		<div class="grid grid-cols-3 gap-6 mb-6">
			{#each ['Déjeuner', 'Diner/souper', 'Boisson'] as category, i}
				{@const menu = getMenuByCategory(category)}

							<ScrollReveal direction="up" duration={500}>
					<div class="flex flex-col items-center gap-4">
						<a 
							href={menu ? getMenuPdfUrl(menu) : '#'}
							target="_blank"
							rel="noopener noreferrer"
							class="block w-full aspect-square overflow-hidden shadow-lg group"
						>
							{#if menu?.image}
								<img 
									src={getMenuImageUrl(menu)} 
									alt={category} 
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							{:else}
								<div class="w-full h-full bg-[var(--color-beige)] flex items-center justify-center">
									<span class="text-[var(--color-gris)]">{category}</span>
								</div>
							{/if}
						</a>
						<a 
							href={menu ? getMenuPdfUrl(menu) : '#'}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-outline text-center w-full block"
						>
							{category === 'Boisson' ? 'Boire' : category}
						</a>
					</div>

							</ScrollReveal>
			{/each}
		</div>

		<ScrollReveal direction="up" delay={350} duration={600}>
			<div class="grid grid-cols-3 gap-6">
				<div class="col-start-2">
					<a href="/promotions" class="btn-dore text-center w-full block">
						Voir nos promotions
					</a>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- ========== PHOTO TRANSITION (image qui se fond dans le crème) ========== -->
<section class="relative bg-[var(--color-creme)]">
	<div class="relative w-full h-[35vh] md:h-[45vh] overflow-hidden">
		<img 
			src={getMediaUrlByIndex(3)}
			alt={getMediaAltByIndex(3)}
			class="w-full h-full object-cover object-center"
		/>
		<!-- Fondu bas : image → crème -->
		<div class="absolute inset-0 bg-gradient-to-b from-[var(--color-creme)]/20 via-transparent to-[var(--color-creme)]"></div>
	</div>
</section>

<!-- ========== SECTION AMBIANCE ========== -->
<section class=" relative bg-[var(--color-creme)]">

	<!-- Titre — grande marge au-dessus, très grande marge en dessous -->
	<div class="pt-36 my-16 pb-28 md:pt-28 md:pb-40 px-6">
		<ScrollReveal direction="up" duration={800}>
			<div class="text-center">
				<h2 class="text-3xl md:text-4xl font-serif text-[var(--color-noir)] mb-3">
					Du brunch lumineux aux soirées chaleureuses.
				</h2>
				<p class="text-[var(--color-brun)] text-base md:text-lg italic">
					Un lieu pour se retrouver.
				</p>
			</div>
		</ScrollReveal>
	</div>

	<!-- Galerie photos — fidèle à la maquette -->
	<div class=" max-w-3xl mx-auto px-8 md:px-12">

		<!-- 1. Grande photo (intérieur du resto, lanternes) -->
		<ScrollReveal direction="up" duration={900}>
			<div class="w-full aspect-[4/3] overflow-hidden ">
				<img 
					src={getMediaUrlByIndex(1)}
					alt={getMediaAltByIndex(1)}
					class="w-full h-full object-cover"
				/>
			</div>
		</ScrollReveal>

		<!-- Petit gap entre la grande photo et les 3 petites -->
		<div class="h-3 md:h-4"></div>

		<!-- 2. Trois petites photos en rangée (gap serré) -->
		<div class="grid grid-cols-3 gap-3">
			{#each [2, 4, 6] as idx, i}
				<ScrollReveal direction="up" delay={i * 100} duration={700}>
					<div class="aspect-square overflow-hidden ">
						<img 
							src={getMediaUrlByIndex(idx)}
							alt={getMediaAltByIndex(idx)}
							class="w-full h-full object-cover"
						/>
					</div>
				</ScrollReveal>
			{/each}
		</div>

		<!-- Petit gap avant la photo horizontale -->
		<div class="h-3 md:h-4"></div>

		<!-- 3. Photo horizontale large (le chef qui cuisine) -->
		<ScrollReveal direction="up" duration={900}>
			<div class="w-full aspect-[2.2/1]  overflow-hidden ">
				<img 
					src={getMediaUrlByIndex(7)}
					alt={getMediaAltByIndex(7)}
					class="w-full h-full object-cover"
				/>
			</div>
		</ScrollReveal>
	</div>

	<!-- Très grande marge après les photos avant la section horaires -->
</section>

<!-- ========== SECTION COMMANDER ========== -->
<section id="commander" class=" py-24 my-32 md:py-36 px-6 bg-[var(--color-creme)]">
	<div class="max-w-2xl mx-auto text-center">
		<ScrollReveal direction="up" duration={800}>
			<h2 class="text-3xl md:text-4xl font-serif text-[var(--color-noir)] mb-3">
				Depuis 2007 à Windsor
			</h2>
			<p class="text-[var(--color-brun)] text-base md:text-lg mb-24">
				Le Moulin est ouvert pour vous recevoir.
			</p>
		</ScrollReveal>

		<ScrollReveal direction="up" delay={200} duration={800}>
			<a href="https://order.ueat.io/integration/67231610-fef4-425a-b795-82f638e434ec/fr#/" class="btn-outline inline-block mb-4">
				Commander en ligne
			</a>
			<p class="text-[var(--color-gris)] text-sm">
				Ouvert 7 jours, du matin au soir
			</p>
		</ScrollReveal>


	</div>
</section>

<!-- ========== FOOTER ========== -->
 <section id="horaires" class="h-16">
<Footer {settings} {sortedHoraires}/>
</section>


<style>
	.hero-parallax {
		position: relative;
		height: 100vh;
		overflow: hidden;
	}
</style>