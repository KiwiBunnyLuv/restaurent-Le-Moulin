<script lang="ts">
	// route: src/routes/contact/+page.svelte
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let settings = $derived(data.settings);
	let horaires = $derived(data.horaires);
	let pocketbaseUrl = $derived(data.pocketbaseUrl);

	// ========== ÉTAT DU FORMULAIRE ==========
	let isSubmitting = $state(false);
	let showSuccess = $state(false);

	// ========== UTILITAIRES ==========
	function getFileUrl(collectionId: string, recordId: string, filename: string): string {
		return `${pocketbaseUrl}/api/files/${collectionId}/${recordId}/${filename}`;
	}

	function getLogoUrl(): string {
		if (settings?.logo) {
			return getFileUrl('Site_Settings', settings.id, settings.logo);
		}
		return '';
	}

	function sortHoraires(h: any[]): any[] {
		const jourOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
		return [...h].sort((a, b) => jourOrder.indexOf(a.Jour) - jourOrder.indexOf(b.Jour));
	}

	let sortedHoraires = $derived(sortHoraires(horaires));

	// ========== SUCCURSALES ==========
	// Adapte les infos selon les vrais emplacements
	const succursales = [
		{
			nom: 'Le Moulin — East Angus',
			adresse: '59 Rue Angus N, East Angus, QC JOB 1R0',
			phone: '(819) 832-4242',
			mapUrl: 'https://maps.google.com/?q=59+Rue+Angus+N+East+Angus+QC'
		},
		{
			nom: 'Le Moulin — Weedon',
			adresse: '481 2e Avenue, Weedon, QC J0B 1R0',
			phone: '(819) 877-3888',
			mapUrl: 'https://maps.google.com/?q=481+2e+Avenue+Weedon+QC'
		}
	];

	// Vérifier si le form action a retourné un succès
	$effect(() => {
		if (form?.success) {
			showSuccess = true;
		}
	});
</script>

<svelte:head>
	<title>Contact - Restaurant Le Moulin à Windsor</title>
	<meta
		name="description"
		content="Contactez le Restaurant Le Moulin à Windsor. Formulaire de contact, adresse, téléphone et horaires d'ouverture."
	/>
</svelte:head>

<Navbar {settings} {getLogoUrl} />

<!-- ============ HERO ============ -->
<section class="hero">
	<div class="hero-bg"></div>
	<div class="hero-content text-center pt-24 pb-16">
		<ScrollReveal direction="up" duration={800}>
			<h1 class="text-5xl md:text-6xl tracking-[0.2em] mb-4">Nous <em>JOINDRE</em></h1>
			<p class="text-lg md:text-xl max-w-2xl mx-auto">
				Une question, une réservation ou simplement envie de nous dire bonjour ? On est là pour vous.
			</p>
		</ScrollReveal>
	</div>
</section>

<!-- ============ CONTENU PRINCIPAL ============ -->
<section class="py-16 md:py-24 px-6 bg-[var(--color-creme)]">
	<div class="max-w-5xl mx-auto">

		<!-- ===== GRID : Formulaire + Infos ===== -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

			<!-- COLONNE GAUCHE : Formulaire -->
			<div>
				<ScrollReveal direction="up" duration={800}>
					<h2 class="text-2xl md:text-3xl font-serif text-[var(--color-noir)] mb-2">
						Écrivez-nous
					</h2>
					<p class="text-[var(--color-gris)] text-sm mb-8">
						Nous vous répondrons dans les plus brefs délais.
					</p>
				</ScrollReveal>

				{#if showSuccess}
					<!-- Message de confirmation -->
					<ScrollReveal direction="up" duration={600}>
						<div class="bg-[var(--color-beige)] border border-[var(--color-dore)]/30 p-8 text-center">
							<div class="text-[var(--color-dore)] mb-3">
								<svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 class="text-lg font-serif text-[var(--color-noir)] mb-2">
								Message envoyé !
							</h3>
							<p class="text-[var(--color-gris)] text-sm">
								Merci de nous avoir contactés. Nous vous reviendrons très bientôt.
							</p>
						</div>
					</ScrollReveal>
				{:else}
					<!-- Formulaire de contact -->
					<ScrollReveal direction="up" delay={100} duration={800}>
						<form
							method="POST"
							action="?/contact"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update }) => {
									await update();
									isSubmitting = false;
								};
							}}
							class="space-y-6"
						>
							<!-- Nom -->
							<div>
								<label for="nom" class="block text-xs tracking-wider text-[var(--color-gris)] mb-2 uppercase">
									Nom
								</label>
								<input
									type="text"
									id="nom"
									name="nom"
									required
									value={form?.nom ?? ''}
									placeholder="Votre nom"
									class="contact-input"
								/>
							</div>

							<!-- Email -->
							<div>
								<label for="email" class="block text-xs tracking-wider text-[var(--color-gris)] mb-2 uppercase">
									Courriel
								</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									value={form?.email ?? ''}
									placeholder="votre@courriel.com"
									class="contact-input"
								/>
							</div>

							<!-- Message -->
							<div>
								<label for="message" class="block text-xs tracking-wider text-[var(--color-gris)] mb-2 uppercase">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									required
									rows="5"
									placeholder="Votre message..."
									class="contact-input resize-none"
								>{form?.message ?? ''}</textarea>
							</div>

							<!-- Erreur -->
							{#if form?.error}
								<p class="text-red-600 text-sm">{form.error}</p>
							{/if}

							<!-- Bouton -->
							<button
								type="submit"
								disabled={isSubmitting}
								class="btn-dore w-full text-center block disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
							</button>
						</form>
					</ScrollReveal>
				{/if}
			</div>

			<!-- COLONNE DROITE : Informations de contact -->
			<div>
				<ScrollReveal direction="up" delay={200} duration={800}>
					<h2 class="text-2xl md:text-3xl font-serif text-[var(--color-noir)] mb-2">
						Nos coordonnées
					</h2>
					<p class="text-[var(--color-gris)] text-sm mb-8">
						Restaurant Le Moulin — Windsor
					</p>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={300} duration={800}>
					<div class="space-y-6">
						<!-- Adresse -->
						<div class="flex items-start gap-4">
							<MapPin class="w-5 h-5 text-[var(--color-dore)] mt-0.5 flex-shrink-0" />
							<div>
								<p class="text-xs tracking-wider text-[var(--color-gris)] mb-1 uppercase">Adresse</p>
								<p class="text-[var(--color-noir)]">
									{settings?.address || '65 Rue Principale S, Windsor, QC J1S 2B6'}
								</p>
							</div>
						</div>

						<!-- Téléphone -->
						{#if settings?.phone}
							<div class="flex items-start gap-4">
								<Phone class="w-5 h-5 text-[var(--color-dore)] mt-0.5 flex-shrink-0" />
								<div>
									<p class="text-xs tracking-wider text-[var(--color-gris)] mb-1 uppercase">Téléphone</p>
									<a
										href="tel:{settings.phone}"
										class="text-[var(--color-noir)] hover:text-[var(--color-dore)] transition-colors"
									>
										{settings.phone}
									</a>
								</div>
							</div>
						{/if}

						<!-- Email -->
						{#if settings?.email}
							<div class="flex items-start gap-4">
								<Mail class="w-5 h-5 text-[var(--color-dore)] mt-0.5 flex-shrink-0" />
								<div>
									<p class="text-xs tracking-wider text-[var(--color-gris)] mb-1 uppercase">Courriel</p>
									<a
										href="mailto:{settings.email}"
										class="text-[var(--color-noir)] hover:text-[var(--color-dore)] transition-colors break-all"
									>
										{settings.email}
									</a>
								</div>
							</div>
						{/if}

						<!-- Horaires -->
						<div class="flex items-start gap-4">
							<Clock class="w-5 h-5 text-[var(--color-dore)] mt-0.5 flex-shrink-0" />
							<div>
								<p class="text-xs tracking-wider text-[var(--color-gris)] mb-2 uppercase">Heures d'ouverture</p>
								<div class="text-sm space-y-1">
									{#each sortedHoraires as horaire}
										<div class="flex justify-between gap-8">
											<span class="text-[var(--color-gris)]">{horaire.Jour}</span>
											<span class="text-[var(--color-noir)]">{horaire.Heure}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</div>
</section>

<!-- ============ SUCCURSALES — "Visitez aussi" ============ -->
<section class="py-16 md:py-24 px-6 bg-[var(--color-beige)]">
	<div class="max-w-5xl mx-auto">
		<ScrollReveal direction="up" duration={800}>
			<div class="text-center mb-12 md:mb-16">
				<h2 class="text-2xl md:text-3xl font-serif text-[var(--color-noir)] mb-2">
					Visitez aussi
				</h2>
				<p class="text-[var(--color-brun)] text-sm italic">
					Nos autres succursales
				</p>
			</div>
		</ScrollReveal>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each succursales as succ, i}
				<ScrollReveal direction="up" delay={i * 150} duration={700}>
					<div class="bg-[var(--color-creme)] p-8 md:p-10 succursale-card">
						<h3 class="text-lg md:text-xl font-serif text-[var(--color-noir)] mb-4 tracking-wide">
							{succ.nom}
						</h3>

						<div class="space-y-3 mb-6">
							<div class="flex items-start gap-3">
								<MapPin class="w-4 h-4 text-[var(--color-dore)] mt-0.5 flex-shrink-0" />
								<span class="text-sm text-[var(--color-noir)]">{succ.adresse}</span>
							</div>
							<div class="flex items-center gap-3">
								<Phone class="w-4 h-4 text-[var(--color-dore)] flex-shrink-0" />
								<a
									href="tel:{succ.phone}"
									class="text-sm text-[var(--color-noir)] hover:text-[var(--color-dore)] transition-colors"
								>
									{succ.phone}
								</a>
							</div>
						</div>

						<a
							href={succ.mapUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-outline-s inline-flex items-center gap-2 text-sm"
						>
							Voir sur Google Maps
							<ExternalLink class="w-3.5 h-3.5" />
						</a>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- ============ CTA FINAL ============ -->
<section class="py-16 md:py-24 px-6 bg-[var(--color-creme)]">
	<div class="max-w-2xl mx-auto text-center">
		<ScrollReveal direction="up" duration={800}>
			<h2 class="text-2xl md:text-3xl font-serif text-[var(--color-noir)] mb-3">
				On a hâte de vous recevoir
			</h2>
			<p class="text-[var(--color-brun)] text-sm mb-10">
				En personne ou en ligne, Le Moulin est toujours ouvert pour vous.
			</p>
		</ScrollReveal>
		<ScrollReveal direction="up" delay={200} duration={800}>
			<a
				href="https://order.ueat.io/integration/67231610-fef4-425a-b795-82f638e434ec/fr#/"
				class="btn-outline inline-block"
			>
				Commander en ligne
			</a>
		</ScrollReveal>
	</div>
</section>

<!-- ============ FOOTER ============ -->
<section id="horaires" class="h-16">
	<Footer {settings} {sortedHoraires} />
</section>

<style>


	/* ===== Inputs du formulaire ===== */
	.contact-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: transparent;
		border: 1px solid var(--color-gris, #999);
		color: var(--color-noir);
		font-size: 0.9rem;
		transition: border-color 0.3s ease;
		outline: none;
	}

	.contact-input::placeholder {
		color: var(--color-gris);
		opacity: 0.6;
	}

	.contact-input:focus {
		border-color: var(--color-dore, #B8964E);
	}

	/* ===== Carte succursale ===== */
	.succursale-card {
		border: 1px solid transparent;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.succursale-card:hover {
		border-color: var(--color-dore, #B8964E);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
	}
</style>