       
<script lang="ts">
	import Template from "$lib/components/admin_template.svelte";
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  
  export let data;
  export let form;
  
  let loading = false;
  let logoPreview: string | null = null;
  
  // Prévisualisation du logo
  function handleLogoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      logoPreview = URL.createObjectURL(input.files[0]);
    }
  }
    // Confirmation avant soumission
  function handleSubmit(event: Event) {
    const confirmed = confirm('Êtes-vous sûr de vouloir enregistrer ces modifications ?');
    if (!confirmed) {
      event.preventDefault();
    }
  }

  </script>
  <Template>
<div class="mx-12 p-6">
  <h1 class="text-2xl font-bold mb-6">Paramètres du site</h1>
  
  {#if form?.success}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {form.message}
    </div>
  {/if}
  
  {#if form?.error}
    <div class="bg-red-100 border border-red-400 text-red-700 py-3 rounded mb-4">
      {form.message}
    </div>
  {/if}

  {#if data.settings}
    <form 
      method="POST" 
      action="?/update"
      enctype="multipart/form-data"
      on:submit={handleSubmit}
      use:enhance={() => {
        loading = true;
        return async ({ update, result }) => {
          loading = false;
          
          // Refresh les données après une mise à jour réussie
          if (result.type === 'success') {
            await invalidateAll();  // <-- Refresh toutes les données
          }
          
          await update({ reset: false }); // reset: false garde les valeurs du form
        };
      }}
      class="space-y-6"
    >
      <!-- ID caché -->
      <input type="hidden" name="id" value={data.settings.id} />
      
      <!-- Nom du site -->
      <div>
        <label for="siteName" class="block text-sm font-medium text-gray-700 mb-1">
          Nom du site
        </label>
        <input 
          type="text" 
          id="siteName"
          name="siteName" 
          value={data.settings.siteName}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      
      <!-- Téléphone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <input 
          type="tel" 
          id="phone"
          name="phone" 
          value={data.settings.phone}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input 
          type="email" 
          id="email"
          name="email" 
          value={data.settings.email}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      
      <!-- Adresse -->
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <textarea 
          id="address"
          name="address" 
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >{data.settings.address}</textarea>
      </div>
      
      <!-- Logo -->
      <div>
        <label for="logo" class="block text-sm font-medium text-gray-700 mb-1">
          Logo
        </label>
        {#if logoPreview || data.settings.logo}
          <img 
            src={logoPreview || `http://127.0.0.1:8090/api/files/Site_Settings/${data.settings.id}/${data.settings.logo}`}
            alt="Logo preview"
            class="w-32 h-32 object-contain mb-2 border rounded"
          />
        {/if}
        <input 
          type="file" 
          id="logo"
          name="logo" 
          accept="image/*"
          on:change={handleLogoChange}
          class="w-full"
        />
      </div>
      
      <!-- Instagram -->
      <div>
        <label for="social_instagram" class="block text-sm font-medium text-gray-700 mb-1">
          lien Instagram
        </label>
        <input 
          type="url" 
          id="social_instagram"
          name="social_instagram" 
          value={data.settings.social_instagram || ''}
          placeholder="https://instagram.com/lemoulin"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

        <!-- Facebook -->
      <div>
        <label for="social_facebook" class="block text-sm font-medium text-gray-700 mb-1">
          lien Facebook
        </label>
        <input 
          type="url" 
          id="facebook"
          name="facebook" 
          value={data.settings.facebook || ''}
          placeholder="https://facebook.com/lemoulin"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

              <!-- Facebook -->
      <div>
        <label for="social_facebook" class="block text-sm font-medium text-gray-700 mb-1">
          lien google maps
        </label>
        <input 
          type="url" 
          id="googleMaps"
          name="googleMaps" 
          value={data.settings.googleMaps || ''}
          placeholder="https://google.com/maps/dir/?api=1&destination=lemoulin"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      
      <!-- Bouton submit -->
      <button 
        type="submit"
        disabled={loading}
        class="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  {:else}
    <p class="text-red-500">Aucun paramètre trouvé. Crée d'abord un enregistrement dans Pocketbase.</p>
  {/if}
</div>

  </Template>



