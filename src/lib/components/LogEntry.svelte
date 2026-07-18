<script lang="ts">
  import { type LogEntryData } from "$lib/data";
  import { ChevronDownIcon } from "@lucide/svelte";
  import { onMount } from "svelte";
  let {
    logEntry,
    expanded,
    toggleExpansion
  }: { logEntry: LogEntryData; expanded: boolean; toggleExpansion: () => void } = $props();

  let date = $derived(new Date(logEntry.isoTime));
  // Format the entry's creation time
  let entryTime = $derived(
    date.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
  );

  let content: HTMLDivElement | undefined;
  // Keep track of the height of the collapsed content
  // so the entry can be expanded to the correct max-height
  // and the transition has the correct timing
  let contentHeight = $state(0);
  const updateContentHeight = () => {
    contentHeight = content?.scrollHeight ?? 0;
  };
  onMount(updateContentHeight);
</script>

<svelte:window onresize={updateContentHeight} />

<div
  class={"rounded-lg mb-4 relative transition-[height] duration-300 border-2 border-neutral-400 bg-green-50/80 backdrop-blur-sm"}
>
  <div class="mx-4 my-3">
    <button class="flex w-full justify-between group" onclick={toggleExpansion}>
      <h3 class="w-fit text-start font-bold text-xl">
        {entryTime + " - " + logEntry.title}
      </h3>
      <ChevronDownIcon
        class={`transition-transform h-fit duration-300 ${expanded ? "rotate-180 group-hover:-translate-y-1" : "group-hover:translate-y-1"}`}
      />
    </button>
    <div
      bind:this={content}
      class={"overflow-hidden w-fit transition-[max-height]"}
      style={"max-height: " + (expanded ? contentHeight : 0) + "px;"}
    >
      <p class="whitespace-pre-line">{logEntry.body}</p>
    </div>
  </div>
</div>
