<script lang="ts">
  import { pb } from "$lib/pb";
  import LoginForm from "$lib/components/login-form.svelte";
  let email = "";
  let password = "";
  let error = "";

  async function login() {
    try {
      await pb.collection("admin").authWithPassword(email, password);
      window.location.href = "/admin";
    } catch (e) {
      error = "Identifiants invalides";
    }
  }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <LoginForm />


</div>


<h1>Connexion admin</h1>

<input placeholder="Email" bind:value={email} />
<input type="password" placeholder="Mot de passe" bind:value={password} />

<button on:click={login}>Se connecter</button>

{#if error}<p>{error}</p>{/if}
