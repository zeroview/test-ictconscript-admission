<script lang="ts">
  import { type LogEntryData } from "$lib/data";
  import { formatDMS } from "$lib/dms";
  import { ChevronDownIcon } from "@lucide/svelte";
  import { onMount } from "svelte";
  let {
    logEntry,
    expanded,
    toggleExpansion
  }: { logEntry: LogEntryData; expanded: boolean; toggleExpansion: () => void } = $props();

  let mapVisible = $state(false);
  $effect(() => {
    if (expanded) {
      mapVisible = true;
    }
  });

  let date = $derived(new Date(logEntry.isoTime));
  // Format the entry's creation time
  let entryTime = $derived(
    date.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
  );

  let details: HTMLDivElement | undefined;
  // Keep track of the height of the collapsed content
  // so the entry can be expanded to the correct max-height
  // and the transition has the correct timing
  let contentHeight = $state(0);
  const updateContentHeight = () => {
    contentHeight = details?.scrollHeight ?? 0;
  };
  onMount(updateContentHeight);

  let coordinates = $derived(
    logEntry.lon !== null && logEntry.lat !== null ? { lng: logEntry.lon, lat: logEntry.lat } : null
  );
</script>

<svelte:window onresize={updateContentHeight} />

<article
  class={"rounded-lg mb-4 relative border-2 border-neutral-400 bg-green-50/80 backdrop-blur-sm"}
>
  <h3 class="font-bold text-xl">
    <button
      class="group px-4 py-3 flex w-full gap-2"
      onclick={toggleExpansion}
      aria-expanded={expanded}
      aria-controls={`entry-${logEntry.id}-details`}
    >
      <div class="flex items-baseline flex-wrap">
        <time datetime={logEntry.isoTime} class="shrink-0 mr-2">{entryTime}</time>
        <span class="text-start before:content-['–'] before:mr-2 flex-[1_1_max-content]"
          >{logEntry.title}</span
        >
      </div>
      <ChevronDownIcon
        aria-hidden
        class={`ml-auto shrink-0 self-center transition-transform h-fit duration-300 ${expanded ? "rotate-180 group-hover:-translate-y-1" : "group-hover:translate-y-1"}`}
      />
    </button>
  </h3>
  <div
    bind:this={details}
    id={`entry-${logEntry.id}-details`}
    class="overflow-y-hidden transition-[max-height_margin-bottom] duration-200 grid gap-4 sm:grid-cols-[1fr_16rem] grid-cols-1 px-4"
    style={`max-height: ${expanded ? contentHeight : 0}px; margin-bottom: ${expanded ? 1 : 0}rem;`}
    inert={!expanded}
    ontransitionend={() => {
      if (!expanded) {
        mapVisible = false;
      }
    }}
  >
    <p class={`whitespace-pre-line ${!coordinates ? "col-span-2" : ""}`}>{logEntry.body}</p>
    {#if coordinates}
      <div class="sm:aspect-square relative w-full sm:h-full h-50">
        {#await import("svelte-maplibre-gl") then { MapLibre, Marker }}
          {#if mapVisible}
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
              center={coordinates}
            >
              <Marker lnglat={coordinates}></Marker>
            </MapLibre>
          {/if}
        {/await}
        <data
          value={`${coordinates.lat},${coordinates.lng}`}
          class="whitespace-pre-line absolute bottom-0 drop-shadow-xs text-center rounded-b-lg font-mono w-full bg-green-50/70"
        >
          {`${formatDMS(coordinates.lat, "lat")} ${formatDMS(coordinates.lng, "lon")}`}
        </data>
      </div>
    {/if}
  </div>
</article>
