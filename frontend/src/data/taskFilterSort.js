const dSortMultipliers = { asc: 1, desc: -1, def: 0 }

/**
 * filters list of tasks using difficulty sort, min and max values
 * @date 2020-09-12
 * @param {Array} tasks
 * @param {number} dmin
 * @param {number} dmax
 * @param {'asc' | 'desc' | 'def'} dsort
 * @param {Set<string>} selectedCategories
 * @returns {Array}
 */
function taskFilterSort(tasks, dmin, dmax, dsort, selectedCategories) {
	let _tasks

	if (selectedCategories.size > 0) {
		_tasks = tasks.filter(({ category }) =>
			selectedCategories.has(category.alias)
		)
	} else {
		_tasks = tasks
	}

	return _tasks
		.filter(({ difficulty }) => dmin <= difficulty && difficulty <= dmax)
		.sort((a, b) => (a.difficulty - b.difficulty) * dSortMultipliers[dsort])
}

export default taskFilterSort
