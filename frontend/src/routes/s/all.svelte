<script context="module">
	export async function preload(page, session) {
		if (session.isAuthenticated !== true) {
			return this.redirect(301, '/login');
		}
		
		const response = await this.fetch('/s/all.json')
		const submissions = await response.json()

		return { submissions }
	}
</script>

<script>
	import { goto } from '@sapper/app'

	import Table from '@/Table.svelte'
	import Result from '@/Result.svelte'

	export let submissions
</script>

<svelte:head>
	<title>Submissions</title>
</svelte:head>

<Table headers={['Identifier', 'Result']}>
	{#each submissions as submission (submission.id)}
		<tr on:click="{() => goto(`/s/${submission.id}`)}">
			<td>{submission.id} <span class="font-bold text-sm text-gray-600">[{submission.name}]</span></td>
			<td>
				<Result points="{submission.result.points}" status="{submission.result.status}" />
			</td>
		</tr>
	{/each}
</Table>
