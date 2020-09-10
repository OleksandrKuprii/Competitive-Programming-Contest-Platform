<script>
	import { stores, goto } from '@sapper/app'
	import { onMount } from 'svelte'
	const { session, page } = stores()

	import Table from '@/Table.svelte'
	import Result from '@/Result.svelte'

	$: headers = ['Name', 'Category', 'Difficulty'].concat(
		$session.isAuthenticated ? ['Best last result'] : []
	)

	export let tasks

	let processedTasks = []

	let difficultySort
	let difficultyMin
	let difficultyMax

	onMount(() => {
		difficultySort = $page.query.sort || $session.difficultySort || 'def'
		difficultyMin = $page.query.min || $session.difficultyMin || 1
		difficultyMax = $page.query.max || $session.difficultyMax || 10
	})

	$: if (
		difficultySort !== undefined &&
		difficultyMin !== undefined &&
		difficultyMax !== undefined
	) {
		if (process.browser) {
			const searchParams = new URLSearchParams(window.location.search)
			searchParams.set('sort', difficultySort)
			searchParams.set('min', difficultyMin)
			searchParams.set('max', difficultyMax)
			const newurl =
				window.location.protocol +
				'//' +
				window.location.host +
				window.location.pathname +
				'?' +
				searchParams.toString()
			window.history.pushState({ path: newurl }, '', newurl)

			$session.difficultySort = difficultySort
		}
	}

	$: processedTasks = [...tasks]
		.filter(
			({ difficulty }) =>
				difficultyMin <= difficulty && difficulty <= difficultyMax
		)
		.sort(
			(a, b) =>
				(a.difficulty - b.difficulty) *
				{ asc: 1, desc: -1, def: 0 }[difficultySort]
		)
</script>

<style>
	section > div {
		width: fit-content;

		@apply mr-2;
	}

	section > div.separator {
		@apply mr-8;
	}
</style>

<section
	class="text-sm bg-gray-900 text-gray-300 px-5 pt-2 rounded-t flex w-full"
>
	<div>
		<div class="flex justify-between">
			<p>Difficulty order</p>
			{#if difficultySort === 'asc'}
				<img
					src="/arrow_downward.svg"
					alt="asc"
					on:click="{() => (difficultySort = 'desc')}"
				/>
			{:else if difficultySort === 'desc'}
				<img
					src="/arrow_upward.svg"
					alt="desc"
					on:click="{() => (difficultySort = 'asc')}"
				/>
			{/if}
		</div>
		<select
			class="bg-gray-800 px-2 py-1 rounded mt-1"
			bind:value="{difficultySort}"
		>
			<option value="def">Default</option>
			<option value="asc">Ascending</option>
			<option value="desc">Descending</option>
		</select>
	</div>

	<div class="separator"></div>

	<div>
		<p>Difficulty range</p>

		<div>
			<!-- svelte-ignore a11y-no-onchange -->
			from: <select
				class="bg-gray-800 px-2 py-1 rounded mt-1"
				bind:value="{difficultyMin}"
				on:change="{() => {
					if (difficultyMin > difficultyMax) {
						difficultyMax = difficultyMin
					}
				}}"
			>
				{#each [...Array(11).keys()].splice(1) as i}
					<option value="{i}">{i}</option>
				{/each}
			</select>
			<!-- svelte-ignore a11y-no-onchange -->
			to: <select
				class="bg-gray-800 px-2 py-1 rounded mt-1"
				bind:value="{difficultyMax}"
				on:change="{() => {
					if (difficultyMin > difficultyMax) {
						difficultyMin = difficultyMax
					}
				}}"
			>
				{#each [...Array(11).keys()].splice(1) as i}
					<option value="{i}">{i}</option>
				{/each}
			</select>
		</div>
	</div>
</section>

<Table headers="{headers}">
	{#each processedTasks as task (task.alias)}
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
