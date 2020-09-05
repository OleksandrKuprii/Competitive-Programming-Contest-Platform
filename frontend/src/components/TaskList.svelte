<script>
	import { stores, goto } from '@sapper/app'
	const { session } = stores()

	import Table from '@/Table.svelte'
	import Result from '@/Result.svelte'

	$: headers = ['Name', 'Category', 'Difficulty'].concat(
		$session.isAuthenticated ? ['Best last result'] : []
	)

	export let tasks
</script>

<Table headers="{headers}">
	{#each tasks as task (task.alias)}
		<tr on:click="{() => goto(`/t/${task.alias}`)}">
			<td data-label="{headers[0]}">{task.name}</td>
			<td data-label="{headers[1]}">{task.category.name}</td>
			<td data-label="{headers[2]}">{task.difficulty}/10</td>
			{#if $session.isAuthenticated === true}
				<td data-label="{headers[3]}">
					<Result
						points="{task.best_submission.points}"
						status="{task.best_submission.status}"
					/>
				</td>
			{/if}
		</tr>
	{/each}
</Table>
