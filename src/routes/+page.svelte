<script lang="ts">
  import LogEntry from "$lib/components/LogEntry.svelte";
  import NewEntryModal from "$lib/components/NewEntryModal.svelte";
  import { PlusIcon } from "@lucide/svelte";
  import { logEntries as storedEntries, type LogEntryData } from "$lib/data";
  import { fade } from "svelte/transition";

  let logEntries = $state(storedEntries);

  // Sort entries newest first
  let sortedEntries = $derived(
    logEntries.toSorted((a, b) => Date.parse(b.isoTime) - Date.parse(a.isoTime))
  );
  // Group entries by their date into an object, using formatted dates as keys
  let groupedEntries = $derived(
    sortedEntries.reduce((entries: Record<string, LogEntryData[]>, entry) => {
      const key = new Date(entry.isoTime).toLocaleDateString("fi-FI", {
        day: "numeric",
        month: "numeric"
      });
      if (!entries[key]) {
        entries[key] = [];
      }
      entries[key].push(entry);
      return entries;
    }, {})
  );

  // Only one entry should be expanded at a time: expanding another one collapses the previous one
  let expandedEntryId: string | undefined = $state();
  let newEntryModalOpen = $state(false);
</script>

{#if newEntryModalOpen}
  <div
    class="flex absolute justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 backdrop-blur-sm z-10"
    transition:fade={{ duration: 100 }}
  >
    <NewEntryModal
      onclose={() => (newEntryModalOpen = false)}
      onsubmit={(data) => {
        logEntries.push({ id: crypto.randomUUID(), ...data });
        newEntryModalOpen = false;
      }}
    />
  </div>
{/if}

<div class="m-auto max-w-4xl mt-5 gap-2 px-6">
  <div class="flex justify-between mb-8 items-center">
    <h1 class="text-4xl font-black text-white underline">Unit Logbook</h1>
    <button
      onclick={() => (newEntryModalOpen = true)}
      class="inline-flex text-2xl gap-2 text-white items-center mr-1"
      >New entry<PlusIcon class="size-7 mt-0.5" /></button
    >
  </div>
  {#each Object.keys(groupedEntries) as date}
    <h2 class="text-white font-extrabold text-3xl">{date}</h2>
    {#each groupedEntries[date] as logEntry (logEntry.id)}
      <LogEntry
        {logEntry}
        expanded={expandedEntryId === logEntry.id}
        toggleExpansion={() => {
          expandedEntryId = expandedEntryId === logEntry.id ? undefined : logEntry.id;
        }}
      />
    {/each}
  {/each}
</div>
