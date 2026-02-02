<script>

	import { Mail, Phone, MapPin } from 'lucide-svelte';

export let settings = {
    address: '65 Rue Principale S, Windsor, QC J1S 2B6',
    phone: '(819) 845-1234',
    email: 'contact@restaurantlemoulin.com',
    horaires: [
        { Jour: 'Lundi', Heure: '06h - 21h' },
        { Jour: 'Mardi', Heure: '06h - 21h' },
        { Jour: 'Mercredi', Heure: '06h - 21h' },
        { Jour: 'Jeudi', Heure: '06h - 21h' },
        { Jour: 'Vendredi', Heure: '06h - 21h' },
        { Jour: 'Samedi', Heure: '06h - 21h' },
        { Jour: 'Dimanche', Heure: '06h - 21h' }
    ]
};
    
    // Trier les horaires par jour de la semaine
    const joursOrdre = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    export let sortedHoraires = [];

    
    if (settings?.horaires) {
        sortedHoraires = settings.horaires.slice().sort((a, b) => {
            return joursOrdre.indexOf(a.Jour) - joursOrdre.indexOf(b.Jour);
        });
    }

</script>

<footer id="contact" class="relative bg-[var(--color-noir)] text-[var(--color-creme)]">
	<div class="grid md:grid-cols-2">
		<!-- Carte Google Maps -->
		<div class="h-[400px] md:h-auto">
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.5!2d-71.9!3d45.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI0JzAwLjAiTiA3McKwNTQnMDAuMCJX!5e0!3m2!1sfr!2sca!4v1234567890"
				width="100%"
				height="100%"
				style="border:0;"
				allowfullscreen=""
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="Localisation du Restaurant Le Moulin"
				class="min-h-[400px]"
			></iframe>
		</div>

		<!-- Informations de contact -->
		<div class="p-12 md:p-16 flex flex-col justify-center">
			<h2 class="text-4xl md:text-5xl font-serif tracking-[0.2em] mb-10">
				NOUS JOINDRE
			</h2>

			<div class="space-y-6">
				<!-- Adresse -->
				<div class="flex items-start gap-4">
					<MapPin class="w-5 h-5 text-[var(--color-dore)] mt-1 flex-shrink-0" />
					<div>
						<p class="text-sm tracking-wider uppercase text-[var(--color-gris)] mb-1">Adresse</p>
						<p class="text-lg">{settings?.address || '65 Rue Principale S, Windsor, QC J1S 2B6'}</p>
					</div>
				</div>

				<!-- Horaires résumé -->
				<div class="pl-9">
					<p class="text-sm tracking-wider uppercase text-[var(--color-gris)] mb-2">Heures d'ouverture</p>
					<div class="text-sm space-y-1">
						{#each sortedHoraires as horaire}
							<div class="flex justify-between max-w-xs">
								<span class="uppercase text-[var(--color-gris)]">{horaire.Jour}</span>
								<span>{horaire.Heure}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Téléphone -->
				{#if settings?.phone}
					<div class="flex items-center gap-4">
						<Phone class="w-5 h-5 text-[var(--color-dore)] flex-shrink-0" />
						<a href="tel:{settings.phone}" class="text-lg hover:text-[var(--color-dore)] transition-colors">
							{settings.phone}
						</a>
					</div>
				{/if}

				<!-- Email -->
				{#if settings?.email}
					<div class="flex items-center gap-4">
						<Mail class="w-5 h-5 text-[var(--color-dore)] flex-shrink-0" />
						<a href="mailto:{settings.email}" class="text-lg hover:text-[var(--color-dore)] transition-colors">
							{settings.email}
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</footer>