<script lang="ts">
	let {
		settings,
		getLogoUrl
	}: {
		settings: any;
		getLogoUrl: () => string;
	} = $props();

	let scrollY = $state(0);
	let lastScrollY = $state(0);
	let visible = $state(true);
	let atTop = $derived(scrollY < 80);

	// Smart navbar : visible en haut OU quand on scroll vers le haut
	$effect(() => {
		if (scrollY < 80) {
			// Toujours visible en haut de page
			visible = true;
		} else if (scrollY < lastScrollY - 5) {
			// Scroll vers le haut (avec 5px de tolérance pour éviter le flickering)
			visible = true;
		} else if (scrollY > lastScrollY + 5) {
			// Scroll vers le bas
			visible = false;
		}
		lastScrollY = scrollY;
	});
</script>

<svelte:window bind:scrollY={scrollY} />

<header
	class="fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
		{visible ? 'translate-y-0' : '-translate-y-full'}
		{atTop ? 'py-4 bg-transparent' : 'pt-1 bg-black/40 backdrop-blur-md shadow-lg'}"
>
	<nav class="max-w-xl mx-auto flex items-center justify-between">
		<!-- Navigation gauche -->
		<div class="flex items-center gap-8">
			<a href="/#horaires" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				Horaire
			</a>
			<a href="/#menu" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				Menu
			</a>
		</div>

		<!-- Logo central -->
		<div class="flex flex-col items-center transition-all duration-500
			{atTop ? '' : 'scale-90'}">
			{#if settings?.logo}
            <a href="/">
				<img src={getLogoUrl()} alt={settings?.siteName || 'Le Moulin'} 
					class="w-auto transition-all duration-500
					{atTop ? 'h-24' : 'h-16'}" 
                     />
            </a>
			{:else}
				<div class="text-[var(--color-creme)] text-center">
					<div class="text-xs tracking-[0.3em] uppercase">Restaurant</div>
					<div class="font-serif text-2xl tracking-wider">LE MOULIN</div>
				</div>
			{/if}
			{#if settings?.phone}
				<a href="tel:{settings.phone}" 
					class="text-[var(--color-creme)] text-sm mt-1 hover:text-[var(--color-dore)] transition-all duration-500
					{atTop ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0 overflow-hidden'}">
					{settings.phone}
				</a>
			{/if}
		</div>

		<!-- Navigation droite -->
		<div class="flex items-center gap-8">
			<a href="/a-propos" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				À propos
			</a>
			<a href="/promotions" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				Promotions
			</a>
		</div>
	</nav>
</header>


<style>
	.nav-link {
		position: relative;
	}
	
	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 1px;
		background-color: var(--color-dore);
		transition: width 0.5s ease;
	}
	
	.nav-link:hover::after {
		width: 100%;
	}
</style>