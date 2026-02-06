<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import type { PageData } from './$types';
	import SplashScreen from '$lib/components/Splashscreen.svelte';
	export let data;

	$: pocketbaseUrl = data.pocketbaseUrl;
	$: settings = data.settings;
	$: horaires = data.horaires;
	$: promotions = data.promotions || [];

	// Construit l'URL d'image Pocketbase :
	// http://127.0.0.1:8090/api/files/COLLECTION_ID/RECORD_ID/FILENAME
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

<svelte:head>
	<title>Promotions | Restaurant Le Moulin</title>
	<meta
		name="description"
		content="Découvrez nos promotions actuelles au Restaurant Le Moulin à Windsor."
	/>
</svelte:head>

<!-- ========== SPLASH SCREEN (Animation d'entrée) ========== -->
<SplashScreen logoUrl={getLogoUrl()} duration={2200}/>

<Navbar {settings} {getLogoUrl}/>
<!-- ============ HERO ============ -->
<section class="hero">
	<div class="hero-bg "></div>
	<div class="hero-content pt-24 pb-16">

		<h1>Nos <em>Promotions</em></h1>
		<div class="hero-divider"></div>
		<p>
			Des offres pensées pour vous faire plaisir. Découvrez ce que nous avons préparé
			spécialement pour vous.
		</p>
	</div>
</section>

<!-- ============ PROMOTIONS ============ -->
<section class="promos-section">
	<div class="promos-container">
		<!-- ÉTAT VIDE -->
		{#if promotions.length === 0}
			<div class="empty">
				<div class="empty-icon">
					<svg
						width="40"
						height="40"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
						/>
					</svg>
				</div>
				<h2>De belles surprises à venir</h2>
				<p>
					Aucune promotion pour le moment, mais revenez nous voir bientôt ! Nous préparons de
					nouvelles offres qui sauront vous plaire.
				</p>
				<a href="/" class="btn-outline" style="display:inline-block; margin-top:2rem;">
					Retour à l'accueil
				</a>
			</div>

			<!-- 1 SEULE PROMO : vedette pleine largeur -->
		{:else if promotions.length === 1}
			{@const promo = promotions[0]}
            <ScrollReveal direction="up" duration={600}>
			<div class="featured">
				{#if promo.image}
					<div class="featured-img">
						<img src={getImageUrl(promo, promo.image)} alt={promo.titre} />
						<span class="featured-badge">En vedette</span>
					</div>
				{/if}
				<div class="featured-body">
					<span class="card-label">Promotion spéciale</span>
					<h2>{promo.titre}</h2>
					<div class="card-rule"></div>
					<p>{promo.description}</p>
					{#if promo.prix}
						<div class="card-price large">{promo.prix.toFixed(2)}&nbsp;$</div>
					{/if}
					
				</div>
			</div>
            </ScrollReveal>
			<!-- 2 PROMOS : 2 colonnes -->
		{:else if promotions.length === 2}
        <ScrollReveal direction="up" duration={600}>
			<div class="grid grid-2">
				{#each promotions as promo, i}
					<article class="card" style="animation-delay: {i * 0.12}s">
						{#if promo.image}
							<div class="card-img">
								<img src={getImageUrl(promo, promo.image)} alt={promo.titre} />
								<div class="card-img-overlay"></div>
								{#if promo.prix}
									<span class="card-img-price">{promo.prix.toFixed(2)}&nbsp;$</span>
								{/if}
							</div>
						{:else}
							<div class="card-placeholder">
								<svg
									width="48"
									height="48"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
									/>
								</svg>
							</div>
						{/if}
						<div class="card-body">
							<h3>{promo.titre}</h3>
							<div class="card-rule"></div>
							<p>{promo.description}</p>
							{#if !promo.image && promo.prix}
								<div class="card-price">{promo.prix.toFixed(2)}&nbsp;$</div>
							{/if}
						</div>
					</article>
				{/each}
			</div>
            </ScrollReveal>
			<!-- 3+ PROMOS : grille responsive -->
		{:else}
            <ScrollReveal direction="up" duration={600}>
			<div class="grid grid-3">
				{#each promotions as promo, i}
					<article class="card" style="animation-delay: {i * 0.1}s">
						{#if promo.image}
							<div class="card-img">
								<img src={getImageUrl(promo, promo.image)} alt={promo.titre} />
								<div class="card-img-overlay"></div>
								{#if promo.prix}
									<span class="card-img-price">{promo.prix.toFixed(2)}&nbsp;$</span>
								{/if}
								
							</div>
						{:else}
							<div class="card-placeholder">
								<svg
									width="48"
									height="48"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
									/>
								</svg>
							</div>
						{/if}
						<div class="card-body">
							<h3>{promo.titre}</h3>
							<div class="card-rule"></div>
							<p>{promo.description}</p>
							{#if !promo.image && promo.prix}
								<div class="card-price">{promo.prix.toFixed(2)}&nbsp;$</div>
							{/if}
						</div>
					</article>
				{/each}
			</div>
            </ScrollReveal>
		{/if}
	</div>
</section>


<Footer {settings} sortedHoraires={horaires} />
