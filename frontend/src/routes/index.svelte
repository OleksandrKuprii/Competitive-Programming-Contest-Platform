<script context="module">
import requiresAuth from '~/utils/requiresAuth'
import { backendURI } from '~/env'

export async function preload(page, session) {
	const result = await requiresAuth(this.fetch, session, (fetch) =>
		fetch(`${backendURI}/tasks/auth?offset=0&number=999`)
	)

	if (!result.error) {
		return { tasks: result.json }
	}

	let response

	switch (result.error.type) {
		case 'unauthorized':
			response = await this.fetch(
				`${backendURI}/tasks?offset=0&number=999`
			)
			return { tasks: await response.json() }
		default:
			console.log(result.error)
	}
}
</script>

<script>
import TaskList from '@/TaskList/index.svelte'

export let tasks
</script>

<svelte:head>
	<title>Tasks</title>
</svelte:head>

<TaskList {tasks} />
