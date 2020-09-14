<style lang="postcss">
	label {
		@apply pb-5 flex flex-col;
	}

	input {
		@apply border border-gray-400 rounded px-2 py-1;
		width: 75px;
		outline: none;
	}

	input:not(:invalid):focus,
	input:not(:invalid):hover {
		@apply border-gray-900;
	}

	input:invalid {
		@apply border-red-500;
	}
</style>

<script>
	export let difficultyMin, difficultyMax

	let min = difficultyMin
	let max = difficultyMax

	$: min = Number(min)
	$: max = Number(max)

	$: error =
		!Number.isInteger(min) ||
		!Number.isInteger(max) ||
		min > max ||
		min < 1 ||
		max > 10

	$: if (!error) {
		difficultyMin = min
		difficultyMax = max
	}
</script>

<div>
	<!-- <div class="flex justify-between">
		<p>Difficulty</p>

		{#if error}
			<span class="text-red-500 font-bold">invalid range</span>
		{/if}
	</div> -->

	<div class="flex justify-between items-center">
		<img alt="grade" src="/grade.svg" class="mr-2" />

		<label class="mr-2">
			<span class="text-sm font-bold">min</span>
			<input type="number" min="1" {max} bind:value={min} />
		</label>
		<label>
			<span class="text-sm font-bold">max</span>
			<input type="number" {min} max="10" bind:value={max} />
		</label>
	</div>
</div>
