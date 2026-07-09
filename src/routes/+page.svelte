<script lang="ts">
	import SampleData from '../../sample-data/data.json';
	type FieldEventData = {
		id: string;
		title: string;
		body: string;
		isoTime: string;
		lat: number | null;
		lon: number | null;
	};

	let eventData: FieldEventData[] = $state(SampleData);
</script>

<h1 class="text-center w-full mb-8 mt-8 font-black font-mono text-4xl underline">UNIT LOGBOOK</h1>
<div class="m-auto w-2xl mt-4 gap-2">
	{#each eventData as event (event.id)}
		<div class="p-4 rounded-xl mb-4 border-2 border-slate-500 bg-slate-200">
			<h2 class="font-bold text-lg">{event.title}</h2>
			<p>{event.body}</p>
		</div>
	{/each}
</div>
