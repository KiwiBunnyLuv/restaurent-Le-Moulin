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
<SplashScreen logoUrl={getLogoUrl()} duration={1000}/>

<svelte:head>
  <title>À propos — {settings?.siteName || 'Restaurant Le Moulin'} à Windsor</title>
  <meta name="description" content="Découvrez l'histoire du Restaurant Le Moulin à Windsor. Depuis 2007, un lieu familial dédié à la cuisine locale et chaleureuse." />
  <link rel="canonical" href="https://lemoulinwindsor.ca/a-propos" />

  <!-- ===== OPEN GRAPH ===== -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Notre histoire — Restaurant Le Moulin" />
  <meta property="og:description" content="Depuis 2007, Le Moulin est un véritable point de rassemblement familial à Windsor." />
  <meta property="og:url" content="https://lemoulinwindsor.ca/a-propos" />
  <meta property="og:image" content={getLogoUrl()} />
  <meta property="og:locale" content="fr_CA" />
  <meta property="og:site_name" content="Restaurant Le Moulin" />

  <!-- ===== TWITTER CARD ===== -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Notre histoire — Restaurant Le Moulin" />
  <meta name="twitter:description" content="Depuis 2007, Le Moulin est un lieu familial à Windsor." />
  <meta name="twitter:image" content={getLogoUrl()} />
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