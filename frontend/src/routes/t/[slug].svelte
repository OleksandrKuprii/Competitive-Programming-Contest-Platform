<script context="module">
	export async function preload(page, session) {
		const { slug } = page.params

		const response = await this.fetch(`http://localhost:4000/task/${slug}`)
		const task = await response.json()

		return { task }
	}
</script>

<script>
	export let task

	import hljs from 'highlight.js'
	import getGeneralLanguageName from '~/utils/getGeneralLanguageName'

	import Button from '@/Button.svelte'

	const sections = [
		{ text: task.main },
		{ name: 'Input format', text: task.input_format },
		{ name: 'Output format', text: task.output_format },
	].concat(
		Object.entries(task.custom_sections).map(([name, text]) => ({
			name,
			text,
		}))
	)

	let files = []
	let code

	let language = 'python3'

	$: if (files.length === 0) {
		code = undefined
	} else {
		files[0]
			.text()
			.then((x) => (code = x))
			.then(() => {
				rehightlight()
				window.scrollTo(
					0,
					document.body.scrollHeight ||
						document.documentElement.scrollHeight
				)
			})
	}

	function rehightlight() {
		console.log('HI')
		const block = document.getElementById('code-preview')
		block.innerHTML = code
		hljs.highlightBlock(block)
	}

	const languageOptions = [
		{ value: 'python3', name: 'Python3' },
		{ value: 'python2', name: 'Python2' },
		{ value: 'c++', name: 'C++' },
		{ value: 'c', name: 'C' },
		{ value: 'pascal', name: 'Pascal' },
	]
</script>

<style>
	label {
		@apply block;
	}

	label[for='file-input'] {
		@apply cursor-pointer px-5 py-2 border-2 rounded;
	}

	.code-preview {
		max-height: 347px;
	}

	.code-preview code {
		overflow: hidden;
		width: fit-content;
	}
</style>

<h1 class="text-3xl font-light">{task.name}</h1>
<div class="text-gray-700 font-bold text-sm">
	<p>Difficulty: {task.difficulty}/10</p>
	<p>Category: {task.category.name}</p>
</div>

<div class="mt-5">
	{#each sections as section}
		{#if section.name}
			<p class="font-bold my-2">{section.name}</p>
		{/if}

		{@html section.text}
	{/each}
</div>
{#if code}
	<pre class="border code-preview rounded overflow-auto mt-10">
        <code
			class="{`language-${getGeneralLanguageName(language)}`}"
			id="code-preview"
		></code>
    </pre>
{/if}

<form
	class="mt-10 bg-black bg-opacity-75 rounded text-white pb-10 pt-5"
	method="post"
>
	<div
		class="lg:w-1/2 sm:w-2/5 w-4/5 mx-auto flex lg:flex-row flex-col
			lg:flex-wrap"
	>
		<p class="py-5 block text-lg w-full">Submit solution</p>

		<div class="w-1/2">
			{#each languageOptions as languageOption}
				<label>
					<input
						type="radio"
						name="lang"
						value="{languageOption.value}"
						bind:group="{language}"
						required
						on:change="{rehightlight}"
					/>
					{languageOption.name}
				</label>
			{/each}
		</div>

		<input type="hidden" name="code" bind:value="{code}" />

		<div class="lg:w-1/2">
			<input
				type="file"
				required
				class="hidden"
				id="file-input"
				bind:files
			/>
			{#if files.length === 0}
				<label
					for="file-input"
					class="bg-red-600 border-red-500 mdMax:mt-5"
				>
					Select file
				</label>
			{:else}
				<label
					for="file-input"
					class="bg-green-600 border-green-500 mdMax:mt-5"
				>
					Selected <strong>"{files[0].name}"</strong>
				</label>
			{/if}
		</div>

		<div class="mt-5">
			<Button value="Submit" formSubmit />
		</div>
	</div>
</form>
