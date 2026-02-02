<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		direction = 'up',
		delay = 0,
		duration = 700,
		distance = 40,
		once = true,
		threshold = 0.15,
		scale = false,
		className = ''
	}: {
		children: Snippet;
		direction?: 'up' | 'down' | 'left' | 'right' | 'none';
		delay?: number;
		duration?: number;
		distance?: number;
		once?: boolean;
		threshold?: number;
		scale?: boolean;
		className?: string;
	} = $props();

	let visible = $state(false);
	let element: HTMLElement;

	$effect(() => {
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					if (once) observer.unobserve(element);
				} else if (!once) {
					visible = false;
				}
			},
			{ threshold }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});

	// Calcule le transform initial selon la direction
	function getInitialTransform(): string {
		const transforms: Record<string, string> = {
			up: `translateY(${distance}px)`,
			down: `translateY(-${distance}px)`,
			left: `translateX(${distance}px)`,
			right: `translateX(-${distance}px)`,
			none: 'translateY(0)'
		};
		let base = transforms[direction] || transforms.up;
		if (scale) base += ' scale(0.95)';
		return base;
	}
</script>

<div
	bind:this={element}
	class={className}
	style="
		opacity: {visible ? 1 : 0};
		transform: {visible ? (scale ? 'translate(0,0) scale(1)' : 'translate(0,0)') : getInitialTransform()};
		transition: opacity {duration}ms ease-out {delay}ms, transform {duration}ms ease-out {delay}ms;
		will-change: opacity, transform;
	"
>
	{@render children()}
</div>