<script lang="ts">
  import LogEntry from "$lib/components/LogEntry.svelte";
  import { logEntries, type LogEntryData } from "$lib/data";

  let sortedEntries = logEntries.sort((a, b) => Date.parse(b.isoTime) - Date.parse(a.isoTime));
  let groupedEntries = sortedEntries.reduce((entries: Record<string, LogEntryData[]>, entry) => {
    const key = new Date(entry.isoTime).toLocaleDateString(undefined, {
      day: "numeric",
      month: "numeric"
    });
    if (!entries[key]) {
      entries[key] = [];
    }
    entries[key].push(entry);
    return entries;
  }, {});

  let expandedEntryId: string | undefined = $state();
</script>

<div class="fixed flex w-full align-center items-center justify-center top-0 h-20 z-5">
  <h1 class="text-center text-4xl font-mono font-black text-white underline">Unit Logbook</h1>
</div>

<div class="m-auto max-w-4xl mt-25 gap-2 px-6">
  {#each Object.keys(groupedEntries) as date}
    <h2 class="text-white font-extrabold font-mono text-3xl">{date}</h2>
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
