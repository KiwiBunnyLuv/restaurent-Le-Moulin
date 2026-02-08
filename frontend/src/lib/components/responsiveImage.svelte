<script lang="ts">
  export let src: string;
  export let alt = '';
  export let sizes: { mobile: number; tablet: number; desktop: number } = {
    mobile: 480,
    tablet: 768,
    desktop: 1200
  };
  export let aspectRatio = '1/1'; // ex: "16/9"
  export let loading: 'lazy' | 'eager' = 'lazy';
  export let fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  export let decoding: 'async' | 'sync' | 'auto' = 'async';
  export let className = '';

  // 2x pour écrans retina
  $: w1 = Math.max(1, Math.round(sizes.mobile));
  $: w2 = Math.max(1, Math.round(sizes.tablet));
  $: w3 = Math.max(1, Math.round(sizes.desktop));
  $: w1x2 = w1 * 2;
  $: w2x2 = w2 * 2;
  $: w3x2 = w3 * 2;

  function withThumb(url: string, w: number): string {
    if (!url) return '';
    // PocketBase thumb crop center-ish: {w}x0 -> largeur fixée, hauteur auto
    // Tu peux utiliser {w}x{h}f si tu veux un crop strict.
    const u = new URL(url, 'http://dummy.local'); // base pour parser même URL relative
    u.searchParams.set('thumb', `${w}x0`);
    u.searchParams.set('format', 'webp');
    u.searchParams.set('quality', '78');

    // retire dummy origin si src était absolue
    const isAbsolute = /^https?:\/\//i.test(url);
    return isAbsolute
      ? `${u.origin}${u.pathname}?${u.searchParams.toString()}`
      : `${u.pathname}?${u.searchParams.toString()}`;
  }

  $: src1 = withThumb(src, w1);
  $: src2 = withThumb(src, w2);
  $: src3 = withThumb(src, w3);
  $: src1_2 = withThumb(src, w1x2);
  $: src2_2 = withThumb(src, w2x2);
  $: src3_2 = withThumb(src, w3x2);

  // Important: vrai sizes CSS
  $: htmlSizes = `(max-width: 640px) ${w1}px, (max-width: 1024px) ${w2}px, ${w3}px`;

  // width/height pour réserver l’espace
  function ratioToWH(r: string, baseW: number): { width: number; height: number } {
    const [a, b] = r.split('/').map(Number);
    if (!a || !b) return { width: baseW, height: baseW };
    return { width: baseW, height: Math.round((baseW * b) / a) };
  }

  $: wh = ratioToWH(aspectRatio, w3);
</script>

<picture>
  <source
    type="image/webp"
    srcset="{src1} {w1}w, {src2} {w2}w, {src3} {w3}w, {src1_2} {w1x2}w, {src2_2} {w2x2}w, {src3_2} {w3x2}w"
    sizes={htmlSizes}
  />
  <img
    src={src2}
    srcset="{src1} {w1}w, {src2} {w2}w, {src3} {w3}w, {src1_2} {w1x2}w, {src2_2} {w2x2}w, {src3_2} {w3x2}w"
    sizes={htmlSizes}
    alt={alt}
    loading={loading}
    fetchpriority={fetchpriority}
    decoding={decoding}
    width={wh.width}
    height={wh.height}
    class={`w-full h-full object-cover ${className}`}
  />
</picture>
