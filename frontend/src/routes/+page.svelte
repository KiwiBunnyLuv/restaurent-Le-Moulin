<script lang="ts">
	//route : src/routes/+page.svelte
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Footer from '$lib/components/footer.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ResponsiveImage from '$lib/components/responsiveImage.svelte';
	import SplashScreen from '$lib/components/Splashscreen.svelte';

	let { data }: { data: PageData } = $props();

	let settings = $derived(data.settings);
	let horaires = $derived(data.horaires);
	let menus = $derived(data.menus);
	let media = $derived(data.media);
	let pocketbaseUrl = $derived(data.pocketbaseUrl);

	// ========== SPLASH SCREEN STATE ==========
	let splashDone = $state(false);

	function onSplashComplete() {
		splashDone = true;
	}

	// ========== FONCTIONS UTILITAIRES IMAGES ==========
	
	/**
	 * Génère l'URL de base d'un fichier Pocketbase
	 */
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

	/**
	 * Retourne l'URL du PDF "menu complet" (tu peux adapter la catégorie ou
	 * créer une entrée spéciale dans ta BD, ex: catégorie "Complet")
	 */
	function getMenuCompletPdfUrl(): string {
		// Option 1 : chercher une catégorie "Complet" ou "Menu complet"
		const menuComplet = menus.find(
			(m: any) => m.Categorie?.toLowerCase() === 'complet' || m.Categorie?.toLowerCase() === 'menu complet'
		);
		if (menuComplet) return getMenuPdfUrl(menuComplet);

		// Option 2 (fallback) : utiliser le menu Diner/souper
		const menuDiner = getMenuByCategory('Diner/souper');
		if (menuDiner) return getMenuPdfUrl(menuDiner);

		return '#';
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

<!-- ========== SPLASH SCREEN (Animation d'entrée) ========== -->
<SplashScreen logoUrl={getLogoUrl()} duration={2200} onComplete={onSplashComplete} />




<!-- ========== HEADER / NAVIGATION ========== -->
<Navbar {settings} {getLogoUrl} />

<!-- ========== HERO SECTION ========== -->
<section class="relative h-screen min-h-[600px] flex items-center justify-center hero-parallax">
	<div class="absolute inset-0 bg-[var(--color-noir)]">
		<!-- Hero image responsive -->
		<ResponsiveImage
			src={getMediaUrlByIndex(0)}
			alt="Restaurant Le Moulin - Façade"
			sizes={{ mobile: 800, tablet: 1200, desktop: 1920 }}
			aspectRatio="16/9"
			loading="eager"
			className="opacity-70"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
	</div>

	<div class="relative z-10 text-center text-[var(--color-creme)] px-4">
		<ScrollReveal direction="up" duration={900} distance={30}>
			<h1 class="text-4xl sm:text-5xl md:text-7xl font-serif mb-4 tracking-wider">
				Restaurant le Moulin
			</h1>
		</ScrollReveal>
		<ScrollReveal direction="up" delay={200} duration={900} distance={20}>
			<p class="text-base sm:text-lg md:text-xl mb-2 tracking-wide">
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
<section class="py-16 md:py-20 px-6 bg-[var(--color-creme)]">
	<div class="max-w-4xl mx-auto text-center my-24 md:my-48">
		<h2 class="text-3xl sm:text-4xl md:text-5xl font-serif mb-8 md:mb-12">
			<span class="text-[var(--color-noir)]">Local. Chaleureux.</span>
			<span class="italic text-[var(--color-brun)]"> Délicieux.</span>
		</h2>

		<ScrollReveal direction="up" delay={300} duration={1000}>
			<p class="text-[var(--color-noir)] text-base md:text-lg leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto">
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
<section id="menu" class="py-12 md:py-16 px-6 bg-[var(--color-creme)] mb-16 md:mb-32 pb-24 md:pb-48">
	<div class="max-w-5xl mx-auto">
		
		<!-- Desktop: Grid 3 colonnes avec images + boutons -->
		<div class="hidden md:grid md:grid-cols-3 gap-6 mb-6">
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
								<ResponsiveImage
									src={getMenuImageUrl(menu)}
									alt={category}
									sizes={{ mobile: 360, tablet: 360, desktop: 360 }}
									aspectRatio="1/1"
									className="group-hover:scale-105 transition-transform duration-500"
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

		<!-- Mobile: Boutons empilés sans images -->
		<div class="flex flex-col items-center gap-4 md:hidden mb-6">
			{#each ['Déjeuner', 'Diner/souper', 'Boisson'] as category, i}
				{@const menu = getMenuByCategory(category)}
				<ScrollReveal direction="up" delay={i * 100} duration={500}>
					<div class="w-full max-w-xs">
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

		<!-- Boutons d'action centrés -->
		<ScrollReveal direction="up" delay={350} duration={600}>
			<div class="flex flex-col items-center gap-4 mt-8 md:mt-0">
				<div class="w-full max-w-xs md:w-auto">
					<a href="/promotions" class="btn-dore text-center w-full block md:px-12">
						Voir nos promotions
					</a>
				</div>
				<div class="w-full max-w-xs md:w-auto">
					<a 
						href={getMenuCompletPdfUrl()}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-outline text-center w-full block md:px-12"
					>
						Menu de livraison
					</a>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- ========== PHOTO TRANSITION (image qui se fond dans le crème) ========== -->
<section class="relative bg-[var(--color-creme)]">
	<div class="relative w-full h-[25vh] md:h-[45vh] overflow-hidden">
		<!-- Image transition responsive -->
		<ResponsiveImage
			src={getMediaUrlByIndex(3)}
			alt={getMediaAltByIndex(3)}
			sizes={{ mobile: 800, tablet: 1200, desktop: 1600 }}
			aspectRatio="21/9"
		/>
		<!-- Fondu bas : image → crème -->
		<div class="absolute inset-0 bg-gradient-to-b from-[var(--color-creme)]/20 via-transparent to-[var(--color-creme)]"></div>
	</div>
</section>

<!-- ========== SECTION AMBIANCE ========== -->
<section class="relative bg-[var(--color-creme)]">

	<!-- Titre — grande marge au-dessus, très grande marge en dessous -->
	<div class="pt-24 md:pt-36 my-12 md:my-16 pb-16 md:pb-40 px-6">
		<ScrollReveal direction="up" duration={800}>
			<div class="text-center">
				<h2 class="text-2xl sm:text-3xl md:text-4xl font-serif text-[var(--color-noir)] mb-3">
					Du brunch lumineux aux soirées chaleureuses.
				</h2>
				<p class="text-[var(--color-brun)] text-sm md:text-base lg:text-lg italic">
					Un lieu pour se retrouver.
				</p>
			</div>
		</ScrollReveal>
	</div>

	<!-- Galerie photos — fidèle à la maquette -->
	<div class="max-w-3xl mx-auto px-4 md:px-8 lg:px-12">

		<!-- 1. Grande photo (intérieur du resto, lanternes) -->
		<ScrollReveal direction="up" duration={900}>
			<div class="w-full aspect-[4/3] overflow-hidden">
				<ResponsiveImage
					src={getMediaUrlByIndex(1)}
					alt={getMediaAltByIndex(1)}
					sizes={{ mobile: 600, tablet: 800, desktop: 1200 }}
					aspectRatio="4/3"
				/>
			</div>
		</ScrollReveal>

		<!-- Gap entre la grande photo et les 3 petites -->
		<div class="h-3 md:h-4"></div>

		<!-- 2. Trois petites photos en rangée -->
		<ScrollReveal direction="up" duration={900}>
			<div class="grid grid-cols-3 gap-3 md:gap-2">
				{#each [2, 4, 6] as idx, i}
					<div class="aspect-square overflow-hidden">
						<ResponsiveImage
							src={getMediaUrlByIndex(idx)}
							alt={getMediaAltByIndex(idx)}
							sizes={{ mobile: 240, tablet: 320, desktop: 400 }}
							aspectRatio="1/1"
						/>
					</div>
				{/each}
			</div>
		</ScrollReveal>

		<!-- Gap avant la photo horizontale -->
		<div class="h-3 md:h-4"></div>

		<!-- 3. Photo horizontale large (le chef) -->
		<ScrollReveal direction="up" duration={900}>
			<div class="w-full aspect-[2.2/1] overflow-hidden">
				<ResponsiveImage
					src={getMediaUrlByIndex(7)}
					alt={getMediaAltByIndex(7)}
					sizes={{ mobile: 600, tablet: 800, desktop: 1200 }}
					aspectRatio="2.2/1"
				/>
			</div>
		</ScrollReveal>

		<!-- Bouton Voir sur Instagram -->
		<ScrollReveal direction="up" delay={200} duration={700}>
			<div class="flex justify-center mt-4">
				<a 
					href="https://instagram.com/restaurantlemoulin" 
					target="_blank" 
					rel="noopener noreferrer"
					class="btn-outline-s inline-flex items-center gap-2"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
					</svg>
					Voir sur Instagram
				</a>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- ========== SECTION COMMANDER ========== -->
<section id="commander" class="py-16 md:py-24 my-16 md:my-32 lg:py-36 px-6 bg-[var(--color-creme)]">
	<div class="max-w-2xl mx-auto text-center">
		<ScrollReveal direction="up" duration={800}>
			<h2 class="text-2xl sm:text-3xl md:text-4xl font-serif text-[var(--color-noir)] mb-3">
				Depuis 2007 à Windsor
			</h2>
			<p class="text-[var(--color-brun)] text-sm md:text-base lg:text-lg mb-16 md:mb-24">
				Le Moulin est ouvert pour vous recevoir.
			</p>
		</ScrollReveal>

		<ScrollReveal direction="up" delay={200} duration={800}>
			<a href="https://order.ueat.io/integration/67231610-fef4-425a-b795-82f638e434ec/fr#/" class="btn-outline inline-block mb-4">
				Commander en ligne
			</a>
			<p class="text-[var(--color-gris)] text-xs md:text-sm">
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