<script lang="ts">
  import { type LogEntryData } from "$lib/data";
  import { formatDMS } from "$lib/dms";
  import { ChevronDownIcon } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { MapLibre, Marker } from "svelte-maplibre-gl";
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

  let lnglat = $derived(
    logEntry.lon !== null && logEntry.lat !== null ? { lng: logEntry.lon, lat: logEntry.lat } : null
  );
</script>

<svelte:window onresize={updateContentHeight} />

<div
  class={"rounded-lg mb-4 relative transition-[height] duration-300 border-2 border-neutral-400 bg-green-50/80 backdrop-blur-sm"}
>
  <button class="flex w-full justify-between group px-4 py-3" onclick={toggleExpansion}>
    <h3 class="w-fit text-start font-bold text-xl">
      {entryTime + " - " + logEntry.title}
    </h3>
    <ChevronDownIcon
      class={`transition-transform h-fit duration-300 ${expanded ? "rotate-180 group-hover:-translate-y-1" : "group-hover:translate-y-1"}`}
    />
  </button>
  <div
    bind:this={content}
    class={`overflow-y-hidden transition-[max-height_margin-bottom] grid gap-4 sm:grid-cols-[1fr_16rem] grid-cols-1 px-4`}
    style={`max-height: ${expanded ? contentHeight : 0}px; margin-bottom: ${expanded ? 1 : 0}rem;`}
  >
    <p class="whitespace-pre-line">{logEntry.body}</p>
    {#if lnglat}
      <div class="sm:aspect-square relative w-full sm:h-full h-50">
        <MapLibre
          class="size-full rounded-lg cursor-pointer"
          zoom={12}
          style={{
            version: 8,
            sources: {
              "raster-tiles": {
                type: "raster",
                tiles: [
                  "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                  "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                  "https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                  "https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                ],
                tileSize: 256
              }
            },
            layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles" }]
          }}
          center={lnglat}
          interactive={false}
        >
          <Marker {lnglat}></Marker>
        </MapLibre>
        <p
          class="whitespace-pre-line absolute bottom-0 drop-shadow-xs text-center rounded-b-lg font-mono w-full bg-green-50/70"
        >
          {`${formatDMS(lnglat.lat, "lat")} ${formatDMS(lnglat.lng, "lon")}`}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
</style>
