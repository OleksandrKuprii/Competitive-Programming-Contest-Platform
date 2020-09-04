<script>
	export let formSubmit = false
	export let value
</script>

<style>
	.button {
		@apply block shadow uppercase text-sm font-bold px-5 py-2 rounded bg-gray-100 text-black;
	}

	.button:hover {
		@apply bg-gray-400;
	}
</style>

{#if formSubmit}
	<input type="submit" value="{value}" class="button" />
{:else}<button class="button">{value}</button>{/if}
