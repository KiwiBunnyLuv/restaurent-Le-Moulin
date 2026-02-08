<script lang="ts">
	import { Mail, Phone, MapPin } from 'lucide-svelte';

	// ✅ Svelte 5 — reçoit les props correctement
	let {
		settings,
		sortedHoraires = []
	}: {
		settings: any;
		sortedHoraires: any[];
	} = $props();

	const currentYear = new Date().getFullYear();

</script>

<footer id="contact" class="relative bg-[var(--color-noir)] text-[var(--color-creme)]">
	<div class="grid md:grid-cols-2">
		<!-- Carte Google Maps -->
		<div class=" md:h-auto">
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.5!2d-71.9!3d45.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cb7b8c8b8c8b8c8%3A0x1234567890abcdef!2s45%20Rue%20Principale%20S%2C%20Windsor%2C%20QC%20J1S%202B6!5e0!3m2!1sfr!2sca!4v1234567890"
				width="100%"
				height="100%"
				style="border:0;"
				allowfullscreen=""
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="Localisation du Restaurant Le Moulin"
				class="min-h-[300px] md:min-h-[400px]"
			></iframe>
		</div>

		<!-- Informations de contact -->
		<div class="flex flex-col justify-center p-8 md:p-12 lg:p-16">
			<h2 class="mb-8 font-serif text-3xl tracking-[0.15em] md:mb-10 md:text-4xl lg:text-5xl">
				Nous joindre
			</h2>

			<div class="space-y-5 md:space-y-6">
				<!-- Adresse -->
				<div class="flex items-start gap-3 md:gap-4">
					<MapPin class="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-dore)]" />
					<div>
						<p class="mb-1 text-xs tracking-wider text-[var(--color-gris)] md:text-sm">Adresse</p>
						<p class="text-base md:text-lg">
							{settings?.address || '65 Rue Principale S, Windsor, QC J1S 2B6'}
						</p>
					</div>
				</div>

				<!-- Horaires résumé -->
				<div class="pl-8 md:pl-9">
					<p class="mb-2 text-xs tracking-wider text-[var(--color-gris)] md:text-sm">
						Heures d'ouverture
					</p>
					<div class="space-y-1 text-xs md:text-sm">
						{#each sortedHoraires as horaire}
							<div class="flex max-w-xs justify-between">
								<span class="text-[var(--color-gris)]">{horaire.Jour}</span>
								<span>{horaire.Heure}</span>
							</div>
						{/each}
					</div>
				</div>

				<a href="/Contact" class="transition-colors hover:text-[var(--color-dore)]">
					Nous joindre
				</a>

				<!-- Téléphone -->
				{#if settings?.phone}
					<div class="flex items-center gap-3 md:gap-4">
						<Phone class="h-5 w-5 flex-shrink-0 text-[var(--color-dore)]" />
						<a
							href="tel:{settings.phone}"
							class="text-base transition-colors hover:text-[var(--color-dore)] md:text-lg"
						>
							{settings.phone}
						</a>
					</div>
				{/if}

				<!-- Email -->
				{#if settings?.email}
					<div class="flex items-center gap-3 md:gap-4">
						<Mail class="h-5 w-5 flex-shrink-0 text-[var(--color-dore)]" />
						<a
							href="mailto:{settings.email}"
							class="text-base break-all transition-colors hover:text-[var(--color-dore)] md:text-lg"
						>
							{settings.email}
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Ligne copyright -->
	<div class="bg-black px-4 py-4 md:px-8">
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-[var(--color-gris)] md:flex-row md:text-sm"
		>
			<!-- Copyright -->
			<p>© {currentYear} Restaurant Le Moulin</p>

			<!-- Réseaux sociaux -->
			<div class="flex items-center gap-4">
				<a
					href={settings?.facebook}
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-[var(--color-dore)]"
					aria-label="Facebook"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
						/>
					</svg>
				</a>
				<a
					href={settings?.instagram}
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-[var(--color-dore)]"
					aria-label="Instagram"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
						/>
					</svg>
				</a>
				<a
					href={settings?.googleMaps}
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-[var(--color-dore)]"
					aria-label="Google"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
						/>
					</svg>
				</a>
			</div>

			<!-- Crédit -->
			<p>
				Créé par <a
					href="https://samitadelyar.com"
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-[var(--color-dore)]">Samit Adelyar</a
				>
			</p>
		</div>
	</div>
</footer>
