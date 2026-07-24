<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <title>Unit Logbook</title>
  <meta
    name="description"
    content="Submission of the 01a-swdev-frontend challenge for the ICT Conscript Admission Test"
  />
  <meta name="author" content="Nuutti Rinne" />
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
