<script lang="ts">
	export let src: string;
	export let alt: string;
	export let sizes: { mobile: number; tablet: number; desktop: number };
	export let aspectRatio: string = 'aspect-video'; // ou 'aspect-square'
	export let loading: 'eager' | 'lazy' = 'lazy';
	export let className: string = '';

	function getThumbnail(width: number, height?: number) {
		const h = height ?? width;
		return `${src}?thumb=${width}x${h}&format=webp`;
	}

	// Calcule hauteur proportionnelle si fourni
	function getHeight(width: number): number | undefined {
		if (aspectRatio === 'aspect-square') return width;
		if (aspectRatio === 'aspect-video') return Math.round(width * 9/16);
		return undefined;
	}
</script>

<picture>
	<!-- Desktop (>1024px) -->
	<source
		media="(min-width: 1024px)"
		srcset="
			{getThumbnail(sizes.desktop, getHeight(sizes.desktop))} 1x,
			{getThumbnail(sizes.desktop * 2, getHeight(sizes.desktop * 2))} 2x
		"
	/>
	
	<!-- Tablet (768px - 1023px) -->
	<source
		media="(min-width: 768px)"
		srcset="
			{getThumbnail(sizes.tablet, getHeight(sizes.tablet))} 1x,
			{getThumbnail(sizes.tablet * 2, getHeight(sizes.tablet * 2))} 2x
		"
	/>
	
	<!-- Mobile (<768px) -->
	<source
		srcset="
			{getThumbnail(sizes.mobile, getHeight(sizes.mobile))} 1x,
			{getThumbnail(sizes.mobile * 2, getHeight(sizes.mobile * 2))} 2x
		"
	/>
	
	<!-- Fallback -->
	<img
		src={getThumbnail(sizes.desktop, getHeight(sizes.desktop))}
		{alt}
		{loading}
		class={`w-full h-full object-cover ${className}`}
	/>
</picture>