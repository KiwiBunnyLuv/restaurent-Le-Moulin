<!--
  CookieBanner.svelte
  Bandeau de consentement aux cookies - Loi 25 (Québec)
  
  UTILISATION :
  1. Copie ce fichier dans src/lib/components/CookieBanner.svelte
  2. Importe-le dans ton +layout.svelte principal
  
  COMMENT ÇA MARCHE :
  - Au premier visit, le bandeau apparaît en bas à gauche
  - Le visiteur clique "Accepter" ou "Refuser"
  - Son choix est sauvegardé dans localStorage (pas un cookie !)
  - Le bandeau ne réapparaît plus pendant 6 mois
  - Tu peux vérifier le consentement avec la fonction getConsent()
-->

<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // --- État du bandeau ---
  let visible = false;
  let animateIn = false;

  // Clé et durée de stockage
  const STORAGE_KEY = 'lm_cookie_consent';
  const EXPIRY_DAYS = 180; // 6 mois

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = new Date().getTime();

        if (data.expiry && now > data.expiry) {
          localStorage.removeItem(STORAGE_KEY);
          showBanner();
        } else {
          if (data.consent === 'accepted') {
            enableServices();
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        showBanner();
      }
    } else {
      showBanner();
    }
  });

  function showBanner() {
    visible = true;
    setTimeout(() => {
      animateIn = true;
    }, 100);
  }

  function handleAccept() {
    saveConsent('accepted');
    enableServices();
    closeBanner();
  }

  function handleRefuse() {
    saveConsent('refused');
    disableServices();
    closeBanner();
  }

  function saveConsent(choice) {
    const expiry = new Date().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const data = {
      consent: choice,
      date: new Date().toISOString(),
      expiry: expiry
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function closeBanner() {
    animateIn = false;
    setTimeout(() => {
      visible = false;
    }, 300);
  }

  function enableServices() {
    if (browser) {
      window.dispatchEvent(new CustomEvent('consent-updated', { detail: { accepted: true } }));
    }
    console.log('[Cookies] Services tiers activés');
  }

  function disableServices() {
    if (browser) {
      window.dispatchEvent(new CustomEvent('consent-updated', { detail: { accepted: false } }));
    }
    console.log('[Cookies] Services tiers désactivés');
  }

  /**
   * Retourne le statut du consentement :
   * - 'accepted' | 'refused' | null
   */
  export function getConsent() {
    if (!browser) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const data = JSON.parse(stored);
      const now = new Date().getTime();
      if (data.expiry && now > data.expiry) return null;
      return data.consent;
    } catch {
      return null;
    }
  }
</script>

{#if visible}
  <!-- Overlay -->
  <div
    class="cookie-overlay"
    class:active={animateIn}
  ></div>

  <!-- Bandeau — positionné en bas à gauche -->
  <div
    class="cookie-banner"
    class:active={animateIn}
    role="dialog"
    aria-label="Consentement aux cookies"
  >
    <div class="cookie-content">
      <p class="cookie-title">Votre vie privée</p>
      <p class="cookie-description">
        Nous utilisons des cookies et services tiers (Google&nbsp;Maps) pour améliorer votre 
        expérience. Conformément à la <strong>Loi 25</strong>, nous avons besoin de votre consentement.
      </p>

      <div class="cookie-actions">
        <button class="btn-cookie-accept" on:click={handleAccept}>
          Accepter
        </button>
        <button class="btn-cookie-refuse" on:click={handleRefuse}>
          Refuser
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .cookie-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 9998;
    transition: background 0.3s ease;
    pointer-events: none;
  }

  .cookie-overlay.active {
    background: rgba(0, 0, 0, 0.12);
  }

  /* =============================
     Bandeau — ancré en bas à gauche
     ============================= */
  .cookie-banner {
    position: fixed;
    bottom: 1.25rem;
    left: 1.25rem;
    z-index: 9999;
    transform: translateY(calc(100% + 2rem));
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cookie-banner.active {
    transform: translateY(0);
  }

  .cookie-content {
    width: 360px;
    max-width: calc(100vw - 2.5rem);
    background-color: var(--color-creme);
    border: 1px solid var(--color-beige);
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 8px 32px rgba(35, 31, 32, 0.12);
    font-family: 'Garet', sans-serif;
    letter-spacing: 0.02em;
  }

  /* Titre — Bauer Bodoni comme tes h1-h6 */
  .cookie-title {
    font-family: 'Bauer Bodoni', serif;
    font-size: 1.15rem;
    font-weight: normal;
    letter-spacing: 0.077em;
    color: var(--color-noir);
    margin: 0;
  }

  .cookie-description {
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--color-brun);
    margin: 0;
  }

  .cookie-description strong {
    color: var(--color-noir);
  }

  .cookie-actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.25rem;
  }

  /* Bouton Accepter — reprend le style btn-dore */
  .btn-cookie-accept {
    flex: 1;
    padding: 0.6rem 1.25rem;
    font-family: 'Garet', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background-color: var(--color-dore);
    color: var(--color-noir);
  }

  .btn-cookie-accept:hover {
    background-color: var(--color-brun);
    color: var(--color-creme);
  }

  /* Bouton Refuser — reprend le style btn-outline */
  .btn-cookie-refuse {
    flex: 1;
    padding: 0.6rem 1.25rem;
    font-family: 'Garet', sans-serif;
    font-size: 0.82rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: transparent;
    color: var(--color-brun);
    border: 1.5px solid var(--color-gris);
  }

  .btn-cookie-refuse:hover {
    background-color: var(--color-beige);
  }

  /* =============================
     Mobile — pleine largeur en bas
     ============================= */
  @media (max-width: 480px) {
    .cookie-banner {
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
    }

    .cookie-content {
      width: auto;
      max-width: none;
    }
  }
</style>