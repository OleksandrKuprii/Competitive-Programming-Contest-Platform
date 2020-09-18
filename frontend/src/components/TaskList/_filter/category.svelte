<style lang="postcss">
label {
	@apply select-none inline-block w-full;
}

input[type='checkbox'] {
	@apply appearance-none block;
}

input[type='checkbox']:checked ~ label > .checked {
	display: inline-block;
}

input[type='checkbox']:checked ~ label > .unchecked {
	display: none;
}
</style>

<script>
import { onMount } from 'svelte'

export let categories

/** @type Set<string> */
export let selectedCategories

let height
let categoryListPadding = 0

onMount(() => {
	height = document.getElementById('categoryList').clientHeight
})

function scrollHandler() {
	if (!height) return

	if (window.scrollY + 200 > height + categoryListPadding) {
		categoryListPadding = window.scrollY + 200 - height
	}

	if (window.scrollY < categoryListPadding) {
		categoryListPadding = window.scrollY
	}
}

function changeHandler(key) {
	return function () {
		if (selectedCategories.has(key)) {
			selectedCategories.delete(key)
		} else {
			selectedCategories.add(key)
		}

		selectedCategories = selectedCategories
	}
}
</script>

<svelte:window on:scroll={scrollHandler} />

<div
	class="flex flex-col pl-3 relative"
	style={`top: ${categoryListPadding}px;`}
	id="categoryList"
>
	{#each Object.entries(categories) as [key, value]}
		<div>
			<input
				type="checkbox"
				id={`category-${key}-checkbox`}
				on:change={changeHandler(key)}
			/>
			<label for={`category-${key}-checkbox`} class="cursor-pointer">
				<img
					class="checked hidden"
					alt="checked"
					src="/check_box.svg"
				/>
				<img
					class="unchecked inline-block"
					alt="unchecked"
					src="/check_box_outline_blank.svg"
				/>
				{value}
			</label>
		</div>
	{/each}
</div>
