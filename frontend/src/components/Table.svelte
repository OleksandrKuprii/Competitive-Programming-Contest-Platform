<script>
	export let headers
	export let tableAuto = true
	export let dense = false
</script>

<style>
	@screen smMax {
		thead {
			clip: rect(0 0 0 0);
			height: 1px;
			margin: -1px;
			overflow: hidden;
			padding: 0;
			position: absolute;
			width: 1px;
		}

		:global(table tr) {
			@apply block w-full mb-5 p-3 border shadow bg-gray-100;
		}

		:global(table td) {
			@apply block py-1 pr-3 text-right;
			min-height: 33px;
		}

		:global(table td:before) {
			content: attr(data-label);
			@apply font-bold float-left pl-3 uppercase text-sm py-1;
		}

		table {
			@apply w-full;
		}
	}

	@screen sm {
		table {
			@apply w-full shadow;
		}

		thead {
			@apply bg-gray-900;
		}

		th {
			@apply text-left font-bold py-3 text-gray-300 text-sm;
		}

		:global(table td),
		table th {
			@apply px-5;
		}

		:global(table td) {
			@apply cursor-pointer;
		}

		:global(table > tbody > tr > td) {
			@apply py-2 border-b;
		}

		:global(table > tbody > tr:hover > td) {
			@apply bg-gray-200;
		}

		:global(table.dense > tbody > tr > td) {
			@apply py-1;
		}
	}
</style>

<table class:table-auto="{tableAuto}" class:dense>
	<thead>
		<tr>
			{#each headers as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		<slot />
	</tbody>
</table>
