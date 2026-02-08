<script lang="ts" module>
	// sample data
	 const data = {
    navMain: [
      {
        title: "Accueil",
        url: "/admin"
      },
      {
        title: "Promotions",
        url: "/admin/promotions",
      },
      {
        title: "Horaire",
        url: "/admin/horaire",
      },
      {
        title: "Media",
        url: "/admin/media",
      },
      {
		title: "Menu",
		url: "/admin/menu",
	  },

    ],
  };
</script>

  <script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
  import type { ComponentProps } from "svelte";
  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();


	async function logout() {
		try {
			await fetch('/admin/logout', { 
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			// Redirige vers login
			window.location.href = '/login';
		} catch (error) {
			console.error('Erreur de déconnexion:', error);
		}
	}
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
							
								<GalleryVerticalEndIcon class="size-4" />

							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-medium">Restaurant le Moulin</span>
								<span class="">Administration</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each data.navMain as item (item.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton class="font-medium">
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									{item.title}
								</a>
							{/snippet}
						</Sidebar.MenuButton>

					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
		<button class="mt-auto mb-4 px-4 py-2 text-sm text-red-600 hover:underline" on:click={logout}>
			se déconnecter
		</button>
	</Sidebar.Content>
	
	<Sidebar.Rail />
</Sidebar.Root>
