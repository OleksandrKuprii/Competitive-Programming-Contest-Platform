<script context="module">
	export async function preload(page, session) {
		const response = await this.fetch('/tasks.json');

		const tasks = await response.json();

		return { tasks }
	}
</script>

<script>
	import { goto } from '@sapper/app';

	export let tasks;
</script>

<svelte:head>
	<title>Tasks</title>
</svelte:head>

<table class="table-auto w-full">
	<thead>
		<tr>
			<th>Name</th>
			<th>Category</th>
			<th>Difficulty</th>
		</tr>
	</thead>
	<tbody>
		{#each tasks as task(task.alias)}
			<tr class="hover:bg-gray-300 cursor-pointer" on:click={() => goto(`/t/${task.alias}`)}>
				<td>{task.name}</td>
				<td>{task.category.name}</td>
				<td>{task.difficulty}/10</td>
			</tr>
		{/each}
	</tbody>
</table>
