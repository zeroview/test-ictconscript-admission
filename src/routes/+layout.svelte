<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="h-dvh bg-[url(/m05.webp)] fixed bg-cover top-0 left-0 right-0 bottom-0 -z-10"></div>

{@render children()}

<style>
  :global(html) {
    overflow-y: scroll;
  }
</style>
