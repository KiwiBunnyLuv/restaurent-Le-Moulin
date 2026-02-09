<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onMount } from 'svelte';

	const bodyClass = 'admin-body';

	onMount(() => {
		document.body.classList.add(bodyClass);
	});

	onDestroy(() => {
		document.body.classList.remove(bodyClass);
	});
</script>

<slot />
