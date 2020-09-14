<script>
	export let tasks

	import TaskList from './_tasklist.svelte'

	import { onMount } from 'svelte'
	import { stores } from '@sapper/app'
	const { session, page } = stores()

	import updateQuery from '~/utils/updateQuery'

	$session.difficultySort = $page.query.sort || 'def'
	$session.difficultyMin = $page.query.min || 1
	$session.difficultyMax = $page.query.max || 10

	$: if (process.browser) {
		updateQuery({
			sort: $session.difficultySort,
			min: $session.difficultyMin,
			max: $session.difficultyMax,
		})
	}
</script>

<TaskList
	{tasks}
	bind:difficultySort={$session.difficultySort}
	bind:difficultyMin={$session.difficultyMin}
	bind:difficultyMax={$session.difficultyMax}
/>
