<script context="module">
	export async function preload() {
		const response = await this.fetch('/tasks.json')

		const tasks = await response.json()

		return { tasks }
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
