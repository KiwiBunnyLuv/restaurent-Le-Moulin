<script lang="ts">
  import Template from "$lib/components/admin_template.svelte"; 
  import { enhance } from "$app/forms";

  export let data;
  export let form;
  
  let loading: string | null = null;

  // Labels français pour les jours
  const jourLabels: Record<string, string> = {
    lundi: 'Lundi',
    mardi: 'Mardi',
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi',
    samedi: 'Samedi',
    dimanche: 'Dimanche'
  };
</script>

<Template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Gestion des Horaires</h1>
    <p class="text-gray-600 mb-6">Mettez à jour les horaires du restaurant.</p>

    <!-- Message de succès/erreur -->
    {#if form?.success}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {form.message}
      </div>
    {/if}
    {#if form?.error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {form.message}
      </div>
    {/if}

    <!-- Grille des horaires -->
    {#if data.Horaires.length === 0}
      <div class="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
        <p class="font-semibold">Aucun horaire trouvé !</p>
        <p class="text-sm">Tu dois d'abord créer les 7 jours directement dans Pocketbase.</p>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.Horaires as horaire}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <!-- Header avec jour -->
            <div class="bg-amber-600 text-white px-4 py-3">
              <h2 class="font-semibold text-lg">
                {jourLabels[horaire.Jour] ?? horaire.Jour}
              </h2>
            </div>

            <!-- Aperçu actuel -->
            <div class="p-4">
              <p class="text-sm text-gray-600">Horaire actuel :</p>
              <p class="font-medium text-lg">
                {horaire.Heure || 'Non défini'}
              </p>
            </div>

            <!-- Formulaire de mise à jour -->
            <form
              method="POST"
              action="?/update"
              use:enhance={() => {
                loading = horaire.id;
                return async ({ update }) => {
                  await update();
                  loading = null;
                };
              }}
              class="border-t p-4 space-y-3 bg-gray-50"
            >
              <input type="hidden" name="id" value={horaire.id} />

              <!-- Champ horaire -->
              <div>
                <label for="Heure-{horaire.id}" class="block text-sm font-medium text-gray-700 mb-1">
                  Nouvel horaire
                </label>
                <input
                  type="text"
                  id="Heure-{horaire.id}"
                  name="Heure"
                  value={horaire.Heure ?? ''}
                  placeholder="Ex: 9h00 à 21h00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- Bouton -->
              <button
                type="submit"
                disabled={loading === horaire.id}
                class="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {#if loading === horaire.id}
                  Mise à jour...
                {:else}
                  Mettre à jour
                {/if}
              </button>
            </form>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</Template>