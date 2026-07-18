<script lang="ts">
  import ChevronDown from "./ChevronDown.svelte";
  import { type LogEntryData } from "$lib/data";
  let {
    logEntry,
    expanded,
    toggleExpansion
  }: { logEntry: LogEntryData; expanded: boolean; toggleExpansion: () => void } = $props();

  let date = $derived(new Date(logEntry.isoTime));
  let entryTime = $derived(
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );

  let content: HTMLDivElement | undefined = $state();
  let contentHeight = $derived(content?.scrollHeight);
</script>

<div
  class={"rounded-lg mb-4 relative transition-[height] duration-300 border-2  border-slate-400 bg-green-50/80 backdrop-blur-sm"}
>
  <div class="mx-4 my-3">
    <button class="flex w-full justify-between" onclick={toggleExpansion}>
      <h3 class="font-mono w-fit text-start font-bold text-xl">
        {entryTime + " - " + logEntry.title}
      </h3>
      <ChevronDown
        class={"transition-transform h-fit duration-300 " + (expanded ? "rotate-180" : "")}
      />
    </button>
    <div
      bind:this={content}
      class={"overflow-hidden w-fit transition-[height]"}
      style={"height: " + (expanded ? contentHeight : 0) + "px;"}
    >
      <p class="font-mono whitespace-pre-line">{logEntry.body}</p>
    </div>
  </div>
</div>
