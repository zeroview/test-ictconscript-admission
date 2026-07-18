<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="h-dvh bg-[url(/m05.webp)] fixed bg-cover top-0 left-0 right-0 bottom-0 -z-10"></div>

{@render children()}
