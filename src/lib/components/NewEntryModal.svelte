<script lang="ts">
  import { XIcon } from "@lucide/svelte";
  import { type LogEntryData } from "$lib/data";
  import flatpickr from "flatpickr";
  import "$lib/flatpickr.css";
  import { onMount } from "svelte";
  type NewLogEntryData = Omit<LogEntryData, "id">;

  let {
    onclose,
    onsubmit
  }: { onclose: () => void; onsubmit: (newLogEntryData: NewLogEntryData) => void } = $props();

  let dateInput: HTMLInputElement | undefined = $state();
  let timeInput: HTMLInputElement | undefined = $state();
  let title = $state("");
  let body = $state("");
  let lat = $state(null);
  let lon = $state(null);

  let canBeSubmitted = $derived(title !== "");

  const submit = () => {
    if (!dateInput || !timeInput) {
      return;
    }
    let data: NewLogEntryData = {
      title,
      body,
      isoTime: new Date(`${dateInput.value}T${timeInput.value}`).toISOString(),
      lat,
      lon
    };
    console.log(data);
    onsubmit(data);
  };

  onMount(() => {
    if (dateInput) {
      flatpickr(dateInput, { defaultDate: Date.now(), altInput: true, altFormat: "j F, Y" });
    }
    if (timeInput) {
      flatpickr(timeInput, {
        defaultDate: Date.now(),
        enableTime: true,
        noCalendar: true,
        time_24hr: true
      });
    }
  });
</script>

<div class="mx-8 sm:mx-16 w-2xl relative p-4 bg-green-50 h-fit rounded-2xl">
  <h2 class="font-bold mb-4 text-2xl text-center">New log entry</h2>

  <form class="grid grid-cols-[6rem_1fr] gap-y-3">
    <label for="date" class="font-semibold">Date:</label>
    <input type="text" id="date" class="cursor-pointer" bind:this={dateInput} />
    <label for="time" class="font-semibold">Time:</label>
    <input type="text" id="time" class="cursor-pointer" bind:this={timeInput} />

    <label for="title" class="font-semibold col-span-2 xs:col-span-1">Title:</label>
    <input
      type="text"
      id="title"
      bind:value={title}
      class="rounded-md px-2 border-2 border-neutral-400 col-span-2 xs:col-span-1"
    />
    <label for="body" class="font-bold col-span-2 xs:col-span-1">Body:</label>
    <textarea
      id="body"
      bind:value={body}
      rows="6"
      class="rounded-md px-2 border-2 border-neutral-400 resize-none col-span-2 xs:col-span-1"
    ></textarea>

    <label for="location" class="font-bold col-span-2 xs:col-span-1">Location:</label>
    <div class="flex gap-2" id="location">
      <label for="lat">Latitude:</label>
      <input
        type="number"
        step="any"
        id="lat"
        class="rounded-md w-30 px-2 border-2 border-neutral-400 col-span-2 xs:col-span-1"
        bind:value={lat}
      />
      <label for="lon" class="ml-10">Longitude:</label>
      <input
        type="number"
        step="any"
        id="lon"
        class="rounded-md w-30 px-2 border-2 border-neutral-400 col-span-2 xs:col-span-1"
        bind:value={lon}
      />
    </div>

    <div class="flex w-full col-span-2 gap-2 justify-end">
      <button
        class="rounded-md px-2 py-1 border-2 border-neutral-500 disabled:border-neutral-300 disabled:text-gray-400"
        onclick={onclose}>Cancel</button
      >
      <button
        class="rounded-md px-2 py-1 border-2 text-white bg-neutral-500 disabled:bg-neutral-300 border-neutral-500 disabled:border-neutral-300"
        onclick={submit}
        disabled={!canBeSubmitted}>Submit</button
      >
    </div>
  </form>

  <button class="absolute top-4 right-4" onclick={onclose}>
    <XIcon class="size-5 transition-transform hover:scale-110" />
  </button>
</div>
