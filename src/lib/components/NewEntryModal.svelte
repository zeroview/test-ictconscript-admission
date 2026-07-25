<script lang="ts">
  import { XIcon } from "@lucide/svelte";
  import { type LogEntryData } from "$lib/data";
  import { onMount } from "svelte";
  import { formatDMS } from "$lib/dms";
  type NewLogEntryData = Omit<LogEntryData, "id">;

  let {
    open = $bindable(false),
    onsubmit
  }: { open: boolean; onsubmit: (newLogEntryData: NewLogEntryData) => void } = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  $effect(() => {
    if (open) dialog?.showModal();
  });

  let dateInput: HTMLInputElement | undefined = $state();
  let timeInput: HTMLInputElement | undefined = $state();
  let title = $state("");
  let body = $state("");

  let lat: number | null = $state(null);
  let latFocused = $state(false);
  let latLabel = $derived(lat ? formatDMS(lat, "lat") : "");
  let lon: number | null = $state(null);
  let lonFocused = $state(false);
  let lonLabel = $derived(lon ? formatDMS(lon, "lon") : "");

  let canBeSubmitted = $derived(title.trim() !== "" && body.trim() !== "");

  const submit = (e: SubmitEvent) => {
    console.log("submitted");
    if (!dateInput || !timeInput || !canBeSubmitted) {
      e.preventDefault();
      return;
    }
    let data: NewLogEntryData = {
      title: title.trim(),
      body: body.trim(),
      isoTime: new Date(`${dateInput.value}T${timeInput.value}`).toISOString(),
      lat,
      lon
    };
    onsubmit(data);
  };

  onMount(async () => {
    const { default: flatpickr } = await import("flatpickr");
    await import("$lib/flatpickr.css");
    if (dateInput) {
      flatpickr(dateInput, {
        defaultDate: Date.now(),
        altInput: true,
        altFormat: "j F, Y",
        appendTo: dialog,
        static: true
      });
    }
    if (timeInput) {
      flatpickr(timeInput, {
        defaultDate: Date.now(),
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        appendTo: dialog,
        static: true
      });
    }
  });
</script>

<dialog
  bind:this={dialog}
  onclose={() => (open = false)}
  aria-label="New log entry"
  id="new-entry-modal"
  class="w-2xl relative p-4 bg-green-50 h-fit rounded-2xl m-auto backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <h2 class="font-bold mb-4 text-2xl text-center">New log entry</h2>

  <button class="absolute top-4 right-4" type="button" onclick={() => dialog?.close()} autofocus>
    <XIcon class="size-5 transition-transform hover:scale-110" />
    <p class="sr-only">Cancel</p>
  </button>

  <form class="grid grid-cols-[7rem_1fr] gap-y-3" onsubmit={submit} method="dialog">
    <label for="date" class="font-semibold">Date:</label>
    <input type="text" id="date" required class="cursor-pointer" bind:this={dateInput} />
    <label for="time" class="font-semibold">Time:</label>
    <input type="text" id="time" required class="cursor-pointer" bind:this={timeInput} />

    <label for="title" class="font-semibold col-span-2 sm:col-span-1">Title:</label>
    <input
      type="text"
      id="title"
      required
      bind:value={title}
      class="rounded-md px-2 border-2 border-neutral-400 col-span-2 sm:col-span-1"
    />
    <label for="body" class="font-bold col-span-2 sm:col-span-1">Body:</label>
    <textarea
      id="body"
      required
      bind:value={body}
      rows="6"
      class="rounded-md px-2 border-2 border-neutral-400 resize-none col-span-2 sm:col-span-1"
    ></textarea>

    <div class="grid col-span-2 grid-cols-[7rem_10rem] md:grid-cols-[7rem_1fr_7rem_10rem] gap-y-3">
      <label for="lat" class="font-bold">Latitude:</label>
      <input
        type={latFocused ? "number" : "text"}
        value={latFocused ? lat : latLabel}
        step="any"
        max="90"
        min="-90"
        id="lat"
        onfocus={() => (latFocused = true)}
        onblur={() => (latFocused = false)}
        onchange={(e) => (lat = Math.min(Math.max(Number(e.currentTarget.value), -90), 90))}
        class="rounded-md w-40 px-2 border-2 border-neutral-400"
      />
      <label for="lon" class="font-bold">Longitude:</label>
      <input
        type={lonFocused ? "number" : "text"}
        value={lonFocused ? lon : lonLabel}
        step="any"
        max="180"
        min="-180"
        id="lon"
        onfocus={() => (lonFocused = true)}
        onblur={() => (lonFocused = false)}
        onchange={(e) => (lon = Math.min(Math.max(Number(e.currentTarget.value), -180), 180))}
        class="rounded-md w-40 px-2 border-2 border-neutral-400"
      />
    </div>

    <div class="flex w-full col-span-2 gap-2 justify-end">
      <button
        class="rounded-md px-2 py-1 border-2 border-neutral-500 disabled:border-neutral-300 disabled:text-gray-400"
        type="button"
        onclick={() => dialog?.close()}>Cancel</button
      >
      <button
        type="submit"
        class="rounded-md px-2 py-1 border-2 text-white bg-neutral-500 disabled:bg-neutral-300 border-neutral-500 disabled:border-neutral-300"
        disabled={!canBeSubmitted}>Submit</button
      >
    </div>
  </form>
</dialog>
