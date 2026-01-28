<script lang="ts">
  import Template from "$lib/components/admin_template.svelte";
  import { enhance } from "$app/forms";
  import { pb } from "$lib/pb";

  export let data;
  export let form;

  let loading: string | null = null; // ID du menu en cours de mise à jour

  // Labels français pour les catégories
  const categoryLabels: Record<string, string> = {
    boissons: '🍷 Boissons',
    dejeuner: '🍳 Déjeuner',
    diner: '🍽️ Dîner/Souper'
  };

  // Génère l'URL d'un fichier depuis Pocketbase
  function getFileUrl(menu: any, filename: string) {
    if (!filename) return null;
    return pb.files.getURL(menu, filename);
  }
</script>

<Template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Gestion des Menus</h1>
    <p class="text-gray-600 mb-6">Mettez à jour les images et PDF pour chaque catégorie de menu.</p>

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

    <!-- Grille des 3 menus -->
    {#if data.menus.length === 0}
      <div class="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
        <p class="font-semibold">Aucun menu trouvé !</p>
        <p class="text-sm">Tu dois d'abord créer les 3 entrées (boissons, dejeuner, diner) directement dans Pocketbase.</p>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-3">
        {#each data.menus as menu}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <!-- Header avec catégorie -->
            <div class="bg-amber-600 text-white px-4 py-3">
              <h2 class="font-semibold text-lg">
                {categoryLabels[menu.Categorie] ?? menu.Categorie}
              </h2>
            </div>

            <!-- Aperçu actuel -->
            <div class="p-4 space-y-3">
              <!-- Image actuelle -->
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Image actuelle :</p>
                {#if menu.image}
                  <img
                    src={getFileUrl(menu, menu.image)}
                    alt="Menu {menu.Categorie}"
                    class="w-full h-32 object-cover rounded"
                  />
                {:else}
                  <div class="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span class="text-gray-400 text-sm">Aucune image</span>
                  </div>
                {/if}
              </div>

              <!-- PDF actuel -->
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">PDF actuel :</p>
                {#if menu.pdf}
                  <a
                    href={getFileUrl(menu, menu.pdf)}
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 underline text-sm"
                  >
                    📄 Voir le PDF
                  </a>
                {:else}
                  <span class="text-gray-400 text-sm">Aucun PDF</span>
                {/if}
              </div>
            </div>

            <!-- Formulaire de mise à jour -->
            <form
              method="POST"
              action="?/update"
              enctype="multipart/form-data"
              use:enhance={() => {
                loading = menu.id;
                return async ({ update }) => {
                  await update();
                  loading = null;
                };
              }}
              class="border-t p-4 space-y-3 bg-gray-50"
            >
              <input type="hidden" name="id" value={menu.id} />

              <!-- Nouvelle image -->
              <div>
                <label for="image-{menu.id}" class="block text-sm font-medium text-gray-700 mb-1">
                  Nouvelle image
                </label>
                <input
                  type="file"
                  id="image-{menu.id}"
                  name="image"
                  accept="image/*"
                  class="w-full text-sm border rounded px-2 py-1"
                />
              </div>

              <!-- Nouveau PDF -->
              <div>
                <label for="pdf-{menu.id}" class="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau PDF
                </label>
                <input
                  type="file"
                  id="pdf-{menu.id}"
                  name="pdf"
                  accept=".pdf"
                  class="w-full text-sm border rounded px-2 py-1"
                />
              </div>

              <!-- Bouton -->
              <button
                type="submit"
                disabled={loading === menu.id}
                class="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {#if loading === menu.id}
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