<script context="module">
import requiresAuth from '~/utils/requiresAuth'
import { backendURI } from '~/env'

export async function preload(page, session) {
	const result = await requiresAuth(this.fetch, session, (fetch) =>
		fetch(`${backendURI}/submissions?offset=0&number=50`)
	)

	if (!result.error) {
		return { submissions: result.json }
	}

	switch (result.error.type) {
		case 'unauthorized':
			return this.redirect('/login')
		default:
			console.log(result.error)
	}
}
</script>

<script>
import { goto } from '@sapper/app'

import Table from '@/Table.svelte'
import Result from '@/Result.svelte'
import FallbackMessage from '@/FallbackMessage.svelte'

const headers = ['Identifier', 'Result']

export let submissions
</script>

<svelte:head>
	<title>Submissions</title>
</svelte:head>

{#if submissions.length > 0}
	<Table {headers}>
		{#each submissions as submission (submission.id)}
			<tr on:click={() => goto(`/s/${submission.id}`)}>
				<td data-label={headers[0]}>
					{submission.id}
					<span
						class="font-bold text-sm text-gray-600"
					>[{submission.name}]</span>
				</td>
				<td data-label={headers[1]}>
					<Result
						points={submission.result.points}
						status={submission.result.status}
					/>
				</td>
			</tr>
		{/each}
	</Table>
{:else}
	<FallbackMessage
		title="Such an empty place!"
		subtitle="Submit some task solutions to see if something changes."
	/>
{/if}
