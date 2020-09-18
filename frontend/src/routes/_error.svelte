<script>
export let status
export let error

import FallbackMessage from '@/FallbackMessage.svelte'

const dev = process.env.NODE_ENV === 'development'

const errorMessages = {
	404: [
		"Oops.. Looks like you've lost",
		"The thing you're looking for probably doesn't exist anymore.",
	],
}

const [title, subtitle] = errorMessages[status] || [
	'Unknown error',
	'Hopefully, issue will be reported.',
]
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<FallbackMessage {title} {subtitle} />

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}
