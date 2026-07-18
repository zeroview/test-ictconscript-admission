<script lang="ts">
  import ChevronDown from "./ChevronDown.svelte";
  import { type LogEntryData } from "$lib/data";
  let { logEntry }: { logEntry: LogEntryData } = $props();

  let date = $derived(new Date(logEntry.isoTime));
  let entryTime = $derived(
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );

  let collapsed = $state(true);
</script>

<div
  class={"p-4 rounded-lg mb-4 relative transition-[height] duration-300 border-2 overflow-hidden border-slate-400 bg-green-50/80 backdrop-blur-sm " +
    (collapsed ? "h-15" : "h-35")}
>
  <button
    class="absolute top-0 right-0 bottom-0 left-0 -z-1"
    onclick={() => {
      collapsed = !collapsed;
    }}
    aria-label={collapsed ? "Expand log entry" : "Collapse log entry"}
  ></button>
  <h3 class="font-mono font-bold text-xl">
    {entryTime + " - " + logEntry.title}
  </h3>
  <p class="font-mono">{logEntry.body}</p>
  <ChevronDown
    class={"absolute top-4 right-4 transition-transform duration-300 " +
      (collapsed ? "" : "rotate-180")}
  />
</div>
