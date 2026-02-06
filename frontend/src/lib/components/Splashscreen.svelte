<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		logoUrl?: string;
		duration?: number;
		onComplete?: () => void;
	}

	let { logoUrl = '', duration = 2200, onComplete }: Props = $props();

	let phase: 'logo' | 'opening' | 'done' = $state('logo');

	onMount(() => {
		// Phase 1: Afficher le logo pendant un moment
		const logoTimer = setTimeout(() => {
			phase = 'opening';
		}, duration * 0.45); // ~1s pour voir le logo

		// Phase 2: Animation d'ouverture (les rideaux s'écartent)
		const openTimer = setTimeout(() => {
			phase = 'done';
			onComplete?.();
		}, duration);

		return () => {
			clearTimeout(logoTimer);
			clearTimeout(openTimer);
		};
	});
</script>

{#if phase !== 'done'}
	<div
		class="splash-overlay"
		class:is-opening={phase === 'opening'}
		aria-hidden="true"
	>
		<!-- Rideau gauche -->
		<div class="splash-curtain splash-curtain--left"></div>
		<!-- Rideau droit -->
		<div class="splash-curtain splash-curtain--right"></div>

		<!-- Logo centré -->
		<div class="splash-logo" class:fade-out={phase === 'opening'}>
			{#if logoUrl}
				<img src={logoUrl} alt="Le Moulin" class="splash-logo-img" />
			{:else}
				<span class="splash-logo-text">Le Moulin</span>
			{/if}
		</div>
	</div>
{/if}

<style>
	.splash-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	/* ===== Rideaux ===== */
	.splash-curtain {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%;
		background-color: var(--color-creme, #F5F0E8);
		transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);
		will-change: transform;
	}

	.splash-curtain--left {
		left: 0;
		transform-origin: left center;
	}

	.splash-curtain--right {
		right: 0;
		transform-origin: right center;
	}

	/* Quand on passe en phase "opening", les rideaux glissent hors écran */
	.is-opening .splash-curtain--left {
		transform: translateX(-100%);
	}

	.is-opening .splash-curtain--right {
		transform: translateX(100%);
	}

	/* ===== Logo ===== */
	.splash-logo {
		position: relative;
		z-index: 10;
		animation: logoEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.splash-logo.fade-out {
		animation: logoFadeOut 0.5s ease-out forwards;
	}

	.splash-logo-img {
		width: 120px;
		height: auto;
		object-fit: contain;
		filter: brightness(0);
	}

	/* Sur desktop, logo un peu plus grand */
	@media (min-width: 768px) {
		.splash-logo-img {
			width: 160px;
		}
	}

	.splash-logo-text {
		font-family: serif;
		font-size: 2rem;
		color: var(--color-noir, #1a1a1a);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	@media (min-width: 768px) {
		.splash-logo-text {
			font-size: 2.5rem;
		}
	}

	/* ===== Keyframes ===== */
	@keyframes logoEntrance {
		0% {
			opacity: 0;
			transform: scale(0.85);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes logoFadeOut {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.30);
		}
	}
</style>