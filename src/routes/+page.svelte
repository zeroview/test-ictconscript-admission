<script lang="ts">
  import LogEntry from "$lib/components/LogEntry.svelte";
  import NewEntryModal from "$lib/components/NewEntryModal.svelte";
  import { PlusIcon } from "@lucide/svelte";
  import { logEntries as storedEntries, type LogEntryData } from "$lib/data";

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
        month: "numeric",
        year: "numeric"
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

<NewEntryModal
  bind:open={newEntryModalOpen}
  onsubmit={(data) => {
    logEntries.push({ id: crypto.randomUUID(), ...data });
  }}
/>

<main class="m-auto max-w-4xl mt-5 gap-2 px-6">
  <header class="flex justify-between gap-4 mb-8 items-center">
    <h1 class="text-4xl font-black text-white underline">Unit Logbook</h1>
    <button
      onclick={() => (newEntryModalOpen = true)}
      class="inline-flex text-2xl text-start gap-2 text-black items-center group mr-1 bg-green-50/80 p-2 hover:bg-green-50/90 rounded-md transition-colors backdrop-blur-sm"
      ><PlusIcon
        class="xs:size-8 size-10 group-hover:scale-110 aspect-square transition-transform"
      />
      <p class="sr-only xs:not-sr-only">New entry</p></button
    >
  </header>
  {#each Object.keys(groupedEntries) as date}
    <h2 class="text-white font-extrabold text-3xl">{date}</h2>
    <ol>
      {#each groupedEntries[date] as logEntry (logEntry.id)}
        <li>
          <LogEntry
            {logEntry}
            expanded={expandedEntryId === logEntry.id}
            toggleExpansion={() => {
              expandedEntryId = expandedEntryId === logEntry.id ? undefined : logEntry.id;
            }}
          />
        </li>
      {/each}
    </ol>
  {/each}
</main>
