<script lang="ts">
  import { pb } from "$lib/pb";
  import LoginForm from "$lib/components/login-form.svelte";
  let email = "";
  let password = "";
  let error = "";

  async function login() {
    try {
      await pb.collection("cms_admins").authWithPassword(email, password);
      window.location.href = "/admin";
    } catch (e) {
      error = "Identifiants invalides";
    }
  }
</script>
<div class="flex h-screen w-full items-center justify-center px-4">
  <LoginForm/>

</div>
