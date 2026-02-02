<script lang="ts">
  import Template from "$lib/components/admin_template.svelte"; 
  import { enhance } from "$app/forms";
  import { pb } from "$lib/pb";

  export let data;
  export let form;
  
  let loading: string | null = null;

  // Génère l'URL de l'image depuis Pocketbase
  function getImageUrl(media: any) {
    if (!media.file) return null;
    return pb.files.getURL(media, media.file);
  }
</script>

<Template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Gestion des Médias</h1>
    <p class="text-gray-600 mb-6">Mettez à jour les images du site.</p>

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

    <!-- Grille des médias -->
    {#if data.Media.length === 0}
      <div class="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
        <p class="font-semibold">Aucun média trouvé !</p>
        <p class="text-sm">Tu dois d'abord créer les entrées directement dans Pocketbase.</p>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each data.Media as media}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <!-- Header avec ordre -->
            <div class="bg-amber-600 text-white px-4 py-2 flex justify-between items-center">
              <h2 class="font-semibold">Image #{media.order}</h2>
            </div>

            <!-- Image actuelle -->
            <div class="p-4">
              {#if media.file}
                <img
                  src={getImageUrl(media)}
                  alt={media.alt || 'Image'}
                  class="w-full h-40 object-cover rounded"
                />
              {:else}
                <div class="w-full h-40 bg-gray-100 rounded flex items-center justify-center">
                  <span class="text-gray-400">Aucune image</span>
                </div>
              {/if}
              
              <!-- Alt actuel -->
              <p class="mt-2 text-sm text-gray-600">
                <span class="font-medium">Alt :</span> {media.alt || 'Non défini'}
              </p>
            </div>

            <!-- Formulaire de mise à jour -->
            <form
              method="POST"
              action="?/update"
              enctype="multipart/form-data"
              use:enhance={() => {
                loading = media.id;
                return async ({ update }) => {
                  await update();
                  loading = null;
                };
              }}
              class="border-t p-4 space-y-3 bg-gray-50"
            >
              <input type="hidden" name="id" value={media.id} />

              <!-- Nouvelle image -->
              <div>
                <label for="file-{media.id}" class="block text-sm font-medium text-gray-700 mb-1">
                  Nouvelle image
                </label>
                <input
                  type="file"
                  id="file-{media.id}"
                  name="file"
                  accept="image/*"
                  class="w-full text-sm border rounded px-2 py-1"
                />
              </div>

              <!-- Texte alternatif -->
              <div>
                <label for="alt-{media.id}" class="block text-sm font-medium text-gray-700 mb-1">
                  Texte alternatif (SEO)
                </label>
                <input
                  type="text"
                  id="alt-{media.id}"
                  name="alt"
                  value={media.alt ?? ''}
                  placeholder="Description de l'image"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- Bouton -->
              <button
                type="submit"
                disabled={loading === media.id}
                class="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {#if loading === media.id}
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