<script lang="ts">
  import Template from "$lib/components/admin_template.svelte";
  import { enhance } from "$app/forms";
  import { pb } from "$lib/pb";


  export let data;
  export let form;

  let loading = false;
  let imagePreview: string | null = null;
  // Pour le mode édition
  let editingPromo: any = null;

  // Génère l'URL de l'image depuis Pocketbase
  function getImageUrl(promo: any) {
    if (!promo.image) return null;
    return pb.files.getURL(promo, promo.image);
  }

  // Preview de l'image sélectionnée
  function handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      imagePreview = URL.createObjectURL(input.files[0]);
    }
  }

  // Passer en mode édition
  function startEdit(promo: any) {
    editingPromo = { ...promo };
    imagePreview = getImageUrl(promo);
  }

  // Annuler l'édition
  function cancelEdit() {
    editingPromo = null;
    imagePreview = null;
  }
</script>


<Template>
  <div class="p-6  mx-12">
    <h1 class="text-2xl font-bold mb-6">Gestion des Promotions</h1>

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

    <!-- FORMULAIRE : Création ou Édition -->
    <div class="bg-white  mb-8">
      <h2 class="text-lg font-semibold mb-4">
        {editingPromo ? 'Modifier la promotion' : 'Ajouter une promotion'}
      </h2>

      <form
        method="POST"
        action={editingPromo ? '?/update' : '?/create'}
        enctype="multipart/form-data"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
            imagePreview = null;
            editingPromo = null;
          };
        }}
        class="space-y-4"
      >
        <!-- ID caché pour l'édition -->
        {#if editingPromo}
          <input type="hidden" name="id" value={editingPromo.id} />
        {/if}

        <!-- Titre -->
        <div>
          <label for="titre" class="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={editingPromo?.titre ?? ''}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ex: Menu midi spécial"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Décrivez la promotion..."
          >{editingPromo?.description ?? ''}</textarea>
        </div>

        <!-- Prix -->
        <div>
          <label for="prix" class="block text-sm font-medium text-gray-700 mb-1">
            Prix ($)
          </label>
          <input
            type="number"
            id="prix"
            name="prix"
            step="0.01"
            min="0"
            value={editingPromo?.prix ?? ''}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="12.99"
          />
        </div>

        <!-- Image -->
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-1">
            Image {editingPromo ? '(laisser vide pour garder l\'actuelle)' : ''}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            on:change={handleImageChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          
          <!-- Preview -->
          {#if imagePreview}
            <img
              src={imagePreview}
              alt="Preview"
              class="mt-2 h-32 w-auto object-cover rounded"
            />
          {/if}
        </div>

        <!-- Boutons -->
        <div class="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {#if loading}
              Chargement...
            {:else}
              {editingPromo ? 'Mettre à jour' : 'Ajouter'}
            {/if}
          </button>

          {#if editingPromo}
            <button
              type="button"
              on:click={cancelEdit}
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
              Annuler
            </button>
          {/if}
        </div>
      </form>
    </div>

    <!-- LISTE des promotions -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Promotions actuelles</h2>

      {#if data.promotions.length === 0}
        <p class="text-gray-500 italic">Aucune promotion pour le moment.</p>
      {:else}
        <div class="space-y-4">
          {#each data.promotions as promo}
            <div class="flex items-center gap-4 p-4 border rounded-lg">
              <!-- Image -->
              {#if promo.image}
                <img
                  src={getImageUrl(promo)}
                  alt={promo.titre}
                  class="h-20 w-20 object-cover rounded"
                />
              {:else}
                <div class="h-20 w-20 bg-gray-200 rounded flex items-center justify-center">
                  <span class="text-gray-400 text-xs">Pas d'image</span>
                </div>
              {/if}

              <!-- Infos -->
              <div class="flex-1">
                <h3 class="font-semibold">{promo.titre}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{promo.description}</p>
                <p class="text-amber-600 font-bold">{promo.prix.toFixed(2)} $</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  on:click={() => startEdit(promo)}
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Modifier
                </button>

                <form method="POST" action="?/delete" use:enhance>
                  <input type="hidden" name="id" value={promo.id} />
                  <button
                    type="submit"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    on:click={(e) => {
                      if (!confirm('Supprimer cette promotion ?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</Template>