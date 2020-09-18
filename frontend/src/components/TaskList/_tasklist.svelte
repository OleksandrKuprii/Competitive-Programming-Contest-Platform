<script>
export let tasks
export let difficultySort
export let difficultyMin
export let difficultyMax

import TaskListTable from './_table.svelte'
import DifficultyFilter from './_filter/difficulty.svelte'
import CategoryFilter from './_filter/category.svelte'

import taskFilterSort from '~/data/taskFilterSort'

$: categories = Object.fromEntries(
	tasks.map((task) => {
		return [task.category.alias, task.category.name]
	})
)

let selectedCategories = new Set()

$: processedTasks = taskFilterSort(
	tasks,
	difficultyMin,
	difficultyMax,
	difficultySort,
	selectedCategories
)
</script>

<div class="flex overflow-hidden">
	<div class="flex flex-col w-full">
		<div class="flex">
			<DifficultyFilter bind:difficultyMin bind:difficultyMax />
		</div>

		<TaskListTable tasks={processedTasks} />
	</div>
	<div style="width: 300px">
		<CategoryFilter {categories} bind:selectedCategories />
	</div>
</div>
