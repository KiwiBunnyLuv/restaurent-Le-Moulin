<script lang="ts">
	//route : src/lib/components/Navbar.svelte
	import { Menu, X } from 'lucide-svelte';
	
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
	let mobileMenuOpen = $state(false);
	let atTop = $derived(scrollY < 80);

	// Smart navbar : visible en haut OU quand on scroll vers le haut
	// MAIS toujours visible si le menu mobile est ouvert
	$effect(() => {
		if (mobileMenuOpen) {
			visible = true;
			return;
		}
		
		if (scrollY < 80) {
			visible = true;
		} else if (scrollY < lastScrollY - 5) {
			visible = true;
		} else if (scrollY > lastScrollY + 5) {
			visible = false;
		}
		lastScrollY = scrollY;
	});

	// Bloquer le scroll du body quand le menu mobile est ouvert
	$effect(() => {
		if (typeof document !== 'undefined') {
			if (mobileMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:window bind:scrollY={scrollY} />

<header
	class="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
		{visible ? 'translate-y-0' : '-translate-y-full'}
		{atTop ? 'py-4 bg-transparent' : 'pt-1 bg-black/40 backdrop-blur-md shadow-lg'}"
>
	<!-- Desktop Navigation -->
	<nav class="hidden md:flex max-w-xl mx-auto items-center justify-between">
		<!-- Navigation gauche -->
		<div class="flex items-center gap-4 w-40">
			<a href="/#horaires" class="nav-link text-[var(--color-creme)] text-sm tracking-wider  hover:text-[var(--color-dore)] transition-colors">
				Contact
			</a>
		<a href="/a-propos" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				À propos
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
		<div class="flex items-center gap-4 w-40">
						<a href="/#menu" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				Menu
			</a>
			<a href="/promotions" class="nav-link text-[var(--color-creme)] text-sm tracking-wider hover:text-[var(--color-dore)] transition-colors">
				Promotions
			</a>
		</div>
	</nav>

	<!-- Mobile Navigation -->
	<nav class="flex md:hidden items-center justify-between">
		<!-- Hamburger button -->
		<button 
			onclick={toggleMobileMenu}
			class="text-[var(--color-creme)] p-2 hover:text-[var(--color-dore)] transition-colors z-50"
			aria-label="Menu"
		>
			{#if mobileMenuOpen}
				<X class="w-6 h-6" />
			{:else}
				<Menu class="w-6 h-6" />
			{/if}
		</button>

		<!-- Logo central mobile -->
		<div class="flex flex-col items-center transition-all duration-500
			{atTop ? '' : 'scale-90'}">
			{#if settings?.logo}
            <a href="/" onclick={closeMobileMenu}>
				<img src={getLogoUrl()} alt={settings?.siteName || 'Le Moulin'} 
					class="w-auto transition-all duration-500
					{atTop ? 'h-16' : 'h-12'}" 
                     />
            </a>
			{:else}
				<div class="text-[var(--color-creme)] text-center">
					<div class="text-[10px] tracking-[0.3em] uppercase">Restaurant</div>
					<div class="font-serif text-xl tracking-wider">LE MOULIN</div>
				</div>
			{/if}
		</div>

		<!-- Placeholder pour équilibrer le flex -->
		<div class="w-10"></div>
	</nav>
</header>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
	<div 
		class="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
		role="dialog"
		aria-modal="true"
	>
		<a 
			href="/#horaires" 
			onclick={closeMobileMenu}
			class="text-[var(--color-creme)] text-2xl tracking-wider hover:text-[var(--color-dore)] transition-colors"
		>
			Horaire
		</a>
		<a 
			href="/#menu" 
			onclick={closeMobileMenu}
			class="text-[var(--color-creme)] text-2xl tracking-wider hover:text-[var(--color-dore)] transition-colors"
		>
			Menu
		</a>
		<a 
			href="/a-propos" 
			onclick={closeMobileMenu}
			class="text-[var(--color-creme)] text-2xl tracking-wider hover:text-[var(--color-dore)] transition-colors"
		>
			À propos
		</a>
		<a 
			href="/promotions" 
			onclick={closeMobileMenu}
			class="text-[var(--color-creme)] text-2xl tracking-wider hover:text-[var(--color-dore)] transition-colors"
		>
			Promotions
		</a>
		{#if settings?.phone}
			<a 
				href="tel:{settings.phone}" 
				class="text-[var(--color-dore)] text-lg mt-4"
			>
				{settings.phone}
			</a>
		{/if}
	</div>
{/if}


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