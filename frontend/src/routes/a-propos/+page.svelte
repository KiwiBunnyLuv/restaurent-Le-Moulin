<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    import ScrollReveal from '$lib/components/ScrollReveal.svelte';
    import { page } from '$app/stores';
	import Footer from '$lib/components/footer.svelte';
   import type { PageData } from './$types'; 
    import SplashScreen from '$lib/components/Splashscreen.svelte';

    export let data;
    
    $: pocketbaseUrl = data.pocketbaseUrl;  
	$: settings = data.settings;
    $: sortedHoraires = data.sortedHoraires;

 
	function getImageUrl(record: any, filename: string): string {
		return `${pocketbaseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
	}

    	function getLogoUrl(): string {
		if (settings?.logo) {
			return getFileUrl('Site_Settings', settings.id, settings.logo);
		}
		return '';
	}

    	function getFileUrl(collectionId: string, recordId: string, filename: string): string {
		return `${pocketbaseUrl}/api/files/${collectionId}/${recordId}/${filename}`;
	}
</script>
<SplashScreen logoUrl={getLogoUrl()} duration={2200}/>
<svelte:head>
    <title>À propos - Restaurant Le Moulin à Windsor</title>
    <meta
        name="description"
        content="En savoir plus sur le Restaurant Le Moulin à Windsor, notre histoire, notre équipe et notre passion pour la cuisine de qualité."
    />
</svelte:head>
<Navbar {settings} {getLogoUrl} />
<!-- ============ HERO ============ -->
<section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content text-center pt-24 pb-16">
        <h1 class="text-5xl md:text-6xl font-serif tracking-[0.2em] mb-4">À PROPOS</h1>
        <p class="text-lg md:text-xl max-w-2xl mx-auto">
            Découvrez l'histoire et la passion qui animent le Restaurant Le Moulin à Windsor. Nous nous engageons à offrir une expérience culinaire exceptionnelle à chaque visite.
        </p>
    </div>
</section>
<!-- ============ ABOUT SECTION ============ -->
<section class="py-20 px-6 md:px-12 max-w-5xl mx-auto">
    <h2 class="text-4xl md:text-5xl font-serif tracking-[0.2em] mb-8 text-center">À PROPOS DE NOUS</h2>
    <p class="text-lg md:text-xl max-w-2xl mx-auto">
        Le Restaurant Le Moulin à Windsor est un établissement familial qui met un point d'honneur à servir des plats faits maison à partir d'ingrédients locaux et de saison. Notre équipe passionnée travaille sans relâche pour créer une expérience culinaire inoubliable pour chacun de nos clients.
    </p>
</section>

<Footer {settings} {sortedHoraires} />