<style>
.loading {
	animation: 1s loading ease-in-out infinite;
}

@keyframes loading {
	from {
		opacity: 1;
	}
	to {
		opacity: 0.5;
	}
}
</style>

<script context="module">
import requiresAuth from '~/utils/requiresAuth'
import { backendURI } from '~/env'

export async function preload(page, session) {
	const result = await requiresAuth(this.fetch, session, (fetch) =>
		fetch(`${backendURI}/submission/${page.params.slug}`)
	)

	if (!result.error) {
		return { submission: { ...result.json, id: page.params.slug } }
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
import { onMount } from 'svelte'
import { goto } from '@sapper/app'
import hljs from 'highlight.js'

export let submission

import Table from '@/Table.svelte'
import Result from '@/Result.svelte'

import getGeneralLanguageName from '~/utils/getGeneralLanguageName'

function handleKeydown({ keyCode }) {
	// ESC
	if (keyCode === 27) {
		goto(`/t/${submission.alias}`)
	}
}

$: running = submission.tests_count !== submission.tests.length

$: if (process.browser && running) {
	setTimeout(() => {
		document.location.reload()
	}, 3000)
}

onMount(() => {
	const codePreview = document.getElementById('code-preview')
	codePreview.innerHTML = submission.code
	hljs.highlightBlock(codePreview)
})

const headers = ['#', 'Result', 'CPU time', 'Wall time']
</script>

<svelte:head>
	<title>Submission #{submission.id}</title>
</svelte:head><a
	rel="prefetch"
	class="block w-full bg-red-200 rounded px-5 py-2 mb-5 font-bold
		hover:bg-red-500"
	href={`/t/${submission.alias}`}
>
	Return to the task page (ESC)
</a>

<svelte:window on:keydown={handleKeydown} />
<div class="flex items-center">
	<h1 class="text-3xl font-light">
		Submission #{submission.id} for {submission.name}
	</h1>
	<span class="font-bold ml-5 uppercase">[{submission.lang}]</span>
</div>

{#if running}
	<h3 class="text-lg">Running ...</h3>
{:else}
	<h3 class="text-lg">
		Total: <strong><Result
				points={submission.result.points}
				status={submission.result.status}
			/></strong>
	</h3>
{/if}

<div class="flex flex-wrap lg:flex-no-wrap mt-5 justify-around">
	<Table {headers} dense={true}>
		{#each submission.tests as test, i}
			<tr>
				<td data-label={headers[0]}>{i + 1}</td>
				<td data-label={headers[1]}>
					<Result points={test.points} status={test.status} />
				</td>
				<td data-label={headers[2]}>{test.cpu_time || '-'}</td>
				<td data-label={headers[3]}>{test.wall_time || '-'}</td>
			</tr>
		{/each}
	</Table>

	<div class="lg:w-1/2 w-full mt-5 lg:mt-0">
		<pre
			class="border code-preview rounded overflow-auto"
		>
            {#if submission.code}
				<code
					class={`language-${getGeneralLanguageName(submission.lang)}`}
					id="code-preview"
					style="height: 500px"
				/>
			{/if}
        </pre>
	</div>
</div>
